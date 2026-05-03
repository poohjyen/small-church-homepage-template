"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB per image
const GALLERY_CATEGORIES = ["예배", "특별행사", "교회학교"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  galleryId: string,
  index: number,
): Promise<UploadResult> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `${file.name}: 이미지 크기는 10MB 이하여야 합니다.` };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: `${file.name}: 이미지 파일만 업로드할 수 있습니다.` };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${galleryId}/${Date.now()}-${index}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("gallery").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function createGallery(formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "";
  const eventDate = (formData.get("event_date") as string | null)?.trim() ?? "";
  if (title.length < 2) return { ok: false, error: "앨범 제목을 입력해 주세요." };
  if (!GALLERY_CATEGORIES.includes(category)) {
    return { ok: false, error: "카테고리를 선택해 주세요." };
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { ok: false, error: "사진을 1장 이상 첨부해 주세요." };
  }

  const coverIndexRaw = formData.get("cover_index");
  const coverIndex = (() => {
    const n = Number(coverIndexRaw);
    if (!Number.isFinite(n) || n < 0 || n >= files.length) return 0;
    return Math.floor(n);
  })();

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { data: gallery, error: insertError } = await supabase
    .from("galleries")
    .insert({
      title,
      category,
      event_date: eventDate || null,
      cover_image: null,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };

  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const upload = await uploadImage(supabase, files[i], gallery.id, i);
    if (!upload.ok) {
      await supabase.from("galleries").delete().eq("id", gallery.id);
      return { ok: false, error: upload.error };
    }
    urls.push(upload.url);
  }

  const imageRows = urls.map((url, i) => ({
    gallery_id: gallery.id,
    image_url: url,
    display_order: i,
  }));
  const { error: imagesError } = await supabase.from("gallery_images").insert(imageRows);
  if (imagesError) {
    await supabase.from("galleries").delete().eq("id", gallery.id);
    return { ok: false, error: imagesError.message };
  }

  await supabase
    .from("galleries")
    .update({ cover_image: urls[coverIndex] })
    .eq("id", gallery.id);

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true, id: gallery.id };
}

export async function updateGallery(id: string, formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "";
  const eventDate = (formData.get("event_date") as string | null)?.trim() ?? "";
  if (title.length < 2) return { ok: false, error: "앨범 제목을 입력해 주세요." };
  if (!GALLERY_CATEGORIES.includes(category)) {
    return { ok: false, error: "카테고리를 선택해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { error: updateError } = await supabase
    .from("galleries")
    .update({
      title,
      category,
      event_date: eventDate || null,
    })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };

  const newFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (newFiles.length > 0) {
    const { count } = await supabase
      .from("gallery_images")
      .select("*", { count: "exact", head: true })
      .eq("gallery_id", id);
    const startIdx = count ?? 0;
    const urls: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const upload = await uploadImage(supabase, newFiles[i], id, startIdx + i);
      if (!upload.ok) return { ok: false, error: upload.error };
      urls.push(upload.url);
    }
    const imageRows = urls.map((url, i) => ({
      gallery_id: id,
      image_url: url,
      display_order: startIdx + i,
    }));
    const { error: imagesError } = await supabase.from("gallery_images").insert(imageRows);
    if (imagesError) return { ok: false, error: imagesError.message };
  }

  revalidatePath("/gallery");
  revalidatePath(`/gallery/${id}`);
  revalidatePath("/admin/gallery");
  return { ok: true, id };
}

export async function setGalleryCover(
  galleryId: string,
  imageUrl: string,
): Promise<Result> {
  if (!imageUrl) return { ok: false, error: "이미지 URL이 비어있습니다." };
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("galleries")
    .update({ cover_image: imageUrl })
    .eq("id", galleryId);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${galleryId}`);
  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${galleryId}/edit`);
  return { ok: true, id: galleryId };
}

export async function deleteGallery(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("galleries")
    .delete()
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function deleteGalleryImage(
  imageId: string,
  galleryId: string,
): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", imageId);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${galleryId}`);
  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function bulkDeleteGalleries(
  formData: FormData,
): Promise<Result & { deleted?: number }> {
  const ids = formData
    .getAll("ids")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  if (ids.length === 0) {
    return { ok: false, error: "삭제할 앨범을 선택해 주세요." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("galleries")
    .delete()
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true, deleted: ids.length };
}

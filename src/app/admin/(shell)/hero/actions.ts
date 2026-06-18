"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

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
): Promise<UploadResult> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "이미지 크기는 10MB 이하여야 합니다." };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: "이미지 파일만 업로드할 수 있습니다." };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("hero")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("hero").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function createHeroSlide(formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const subtitle = (formData.get("subtitle") as string | null)?.trim() ?? "";
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "이미지를 첨부해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const upload = await uploadImage(supabase, file);
  if (!upload.ok) return { ok: false, error: upload.error };

  const { count } = await supabase
    .from("hero_slides")
    .select("*", { count: "exact", head: true });
  const display_order = count ?? 0;

  const { data, error: insertError } = await supabase
    .from("hero_slides")
    .insert({
      image_url: upload.url,
      title: title || null,
      subtitle: subtitle || null,
      display_order,
      is_active: true,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true, id: data.id };
}

export async function updateHeroSlide(id: string, formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const subtitle = (formData.get("subtitle") as string | null)?.trim() ?? "";

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const update: Partial<{
    title: string | null;
    subtitle: string | null;
    image_url: string;
  }> = {
    title: title || null,
    subtitle: subtitle || null,
  };

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadImage(supabase, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    update.image_url = upload.url;
  }

  const { error: updateError } = await supabase
    .from("hero_slides")
    .update(update)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true, id };
}

export async function toggleHeroSlide(id: string, isActive: boolean): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("hero_slides")
    .update({ is_active: isActive })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function reorderHeroSlide(id: string, direction: "up" | "down"): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { data: all, error: fetchError } = await supabase
    .from("hero_slides")
    .select("id, display_order")
    .order("display_order", { ascending: true });
  if (fetchError) return { ok: false, error: fetchError.message };
  if (!all) return { ok: false, error: "슬라이드를 찾을 수 없습니다." };

  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return { ok: false, error: "슬라이드를 찾을 수 없습니다." };
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= all.length) return { ok: true };

  const a = all[idx];
  const b = all[targetIdx];
  const { error: e1 } = await supabase
    .from("hero_slides")
    .update({ display_order: b.display_order })
    .eq("id", a.id);
  if (e1) return { ok: false, error: e1.message };
  const { error: e2 } = await supabase
    .from("hero_slides")
    .update({ display_order: a.display_order })
    .eq("id", b.id);
  if (e2) return { ok: false, error: e2.message };

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true };
}

export async function deleteHeroSlide(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("hero_slides")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true };
}

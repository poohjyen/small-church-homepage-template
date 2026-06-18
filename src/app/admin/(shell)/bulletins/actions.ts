"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_PDF_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_THUMB_BYTES = 10 * 1024 * 1024; // 10 MB

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

function validateText(
  value: FormDataEntryValue | null,
  label: string,
  min = 1,
  max = 200,
): { ok: true; value: string } | { ok: false; error: string } {
  const v = typeof value === "string" ? value.trim() : "";
  if (v.length < min) return { ok: false, error: `${label}을(를) 입력해 주세요.` };
  if (v.length > max) return { ok: false, error: `${label}이(가) 너무 깁니다.` };
  return { ok: true, value: v };
}

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

async function uploadPdf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<UploadResult> {
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: "PDF 파일은 50MB 이하여야 합니다." };
  }
  if (file.type && !file.type.includes("pdf")) {
    return { ok: false, error: "PDF 파일만 업로드할 수 있습니다." };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("bulletins")
    .upload(path, file, { contentType: file.type || "application/pdf", upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("bulletins").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

async function uploadThumbnail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<UploadResult> {
  if (file.size > MAX_THUMB_BYTES) {
    return { ok: false, error: "표지 이미지는 10MB 이하여야 합니다." };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: "표지는 이미지 파일이어야 합니다." };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `thumbnails/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("bulletins")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("bulletins").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function createBulletin(formData: FormData): Promise<Result> {
  const titleR = validateText(formData.get("title"), "주보 제목", 2, 200);
  if (!titleR.ok) return { ok: false, error: titleR.error };
  const dateR = validateText(formData.get("bulletin_date"), "주보 날짜", 1, 32);
  if (!dateR.ok) return { ok: false, error: dateR.error };

  const file = formData.get("pdf_file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "PDF 파일을 첨부해 주세요." };
  }

  const attachColumn = formData.get("attach_column") === "true";
  const columnTitle = (formData.get("column_title") as string | null)?.trim() ?? "";
  const columnContent = (formData.get("column_content") as string | null)?.trim() ?? "";
  if (attachColumn) {
    if (columnTitle.length < 2) return { ok: false, error: "칼럼 제목을 입력해 주세요." };
    if (columnContent.length < 5) return { ok: false, error: "칼럼 본문을 입력해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const upload = await uploadPdf(supabase, file);
  if (!upload.ok) return { ok: false, error: upload.error };

  let thumbnailUrl: string | null = null;
  const thumbFile = formData.get("thumbnail_file");
  if (thumbFile instanceof File && thumbFile.size > 0) {
    const thumbUpload = await uploadThumbnail(supabase, thumbFile);
    if (!thumbUpload.ok) return { ok: false, error: thumbUpload.error };
    thumbnailUrl = thumbUpload.url;
  }

  const { data: bulletin, error: insertError } = await supabase
    .from("bulletins")
    .insert({
      title: titleR.value,
      bulletin_date: dateR.value,
      pdf_url: upload.url,
      thumbnail_url: thumbnailUrl,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };

  if (attachColumn) {
    const { error: columnError } = await supabase.from("pastoral_columns").insert({
      title: columnTitle,
      content: columnContent,
      published_date: dateR.value,
    });
    if (columnError) return { ok: false, error: `주보는 등록되었으나 칼럼 등록 실패: ${columnError.message}` };
    revalidatePath("/columns");
    revalidatePath("/admin/columns");
  }

  revalidatePath("/bulletins");
  revalidatePath("/admin/bulletins");
  return { ok: true, id: bulletin.id };
}

export async function updateBulletin(id: string, formData: FormData): Promise<Result> {
  const titleR = validateText(formData.get("title"), "주보 제목", 2, 200);
  if (!titleR.ok) return { ok: false, error: titleR.error };
  const dateR = validateText(formData.get("bulletin_date"), "주보 날짜", 1, 32);
  if (!dateR.ok) return { ok: false, error: dateR.error };

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const update: Partial<{
    title: string;
    bulletin_date: string;
    pdf_url: string;
    thumbnail_url: string;
  }> = {
    title: titleR.value,
    bulletin_date: dateR.value,
  };

  const file = formData.get("pdf_file");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadPdf(supabase, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    update.pdf_url = upload.url;
  }

  const thumbFile = formData.get("thumbnail_file");
  if (thumbFile instanceof File && thumbFile.size > 0) {
    const thumbUpload = await uploadThumbnail(supabase, thumbFile);
    if (!thumbUpload.ok) return { ok: false, error: thumbUpload.error };
    update.thumbnail_url = thumbUpload.url;
  }

  const { error: updateError } = await supabase
    .from("bulletins")
    .update(update)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/bulletins");
  revalidatePath("/admin/bulletins");
  return { ok: true, id };
}

export async function deleteBulletin(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("bulletins")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/bulletins");
  revalidatePath("/admin/bulletins");
  return { ok: true };
}

export async function bulkDeleteBulletins(
  formData: FormData,
): Promise<Result & { deleted?: number }> {
  const ids = formData
    .getAll("ids")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  if (ids.length === 0) {
    return { ok: false, error: "삭제할 항목을 선택해 주세요." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("bulletins")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/bulletins");
  revalidatePath("/admin/bulletins");
  return { ok: true, deleted: ids.length };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const RESOURCE_CATEGORIES = ["신청서식", "소개자료", "교육자료", "회의록", "기타"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

type UploadResult =
  | { ok: true; url: string; size: number }
  | { ok: false; error: string };

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<UploadResult> {
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: "파일은 50MB 이하여야 합니다." };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._\-가-힣]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("resources")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("resources").getPublicUrl(path);
  return { ok: true, url: data.publicUrl, size: file.size };
}

export async function createResource(formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  if (title.length < 2) return { ok: false, error: "자료 제목을 입력해 주세요." };
  if (!RESOURCE_CATEGORIES.includes(category)) {
    return { ok: false, error: "카테고리를 선택해 주세요." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "파일을 첨부해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const upload = await uploadFile(supabase, file);
  if (!upload.ok) return { ok: false, error: upload.error };

  const { data, error: insertError } = await supabase
    .from("resources")
    .insert({
      title,
      category,
      description: description || null,
      file_url: upload.url,
      file_size: upload.size,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  return { ok: true, id: data.id };
}

export async function updateResource(id: string, formData: FormData): Promise<Result> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  if (title.length < 2) return { ok: false, error: "자료 제목을 입력해 주세요." };
  if (!RESOURCE_CATEGORIES.includes(category)) {
    return { ok: false, error: "카테고리를 선택해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const update: Partial<{
    title: string;
    category: string;
    description: string | null;
    file_url: string;
    file_size: number;
  }> = {
    title,
    category,
    description: description || null,
  };

  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadFile(supabase, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    update.file_url = upload.url;
    update.file_size = upload.size;
  }

  const { error: updateError } = await supabase
    .from("resources")
    .update(update)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  return { ok: true, id };
}

export async function deleteResource(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("resources")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  return { ok: true };
}

export async function bulkDeleteResources(
  formData: FormData,
): Promise<Result & { deleted?: number }> {
  const ids = formData
    .getAll("ids")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  if (ids.length === 0) {
    return { ok: false, error: "삭제할 자료를 선택해 주세요." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("resources")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/resources");
  revalidatePath("/admin/resources");
  return { ok: true, deleted: ids.length };
}

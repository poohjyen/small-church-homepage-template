"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  adminSermonSchema,
  extractYoutubeId,
  type AdminSermonInput,
} from "@/lib/forms/admin-schemas";

type Result = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

function toRow(input: AdminSermonInput) {
  const youtube_id = extractYoutubeId(input.youtube_url);
  if (!youtube_id) {
    return { error: "유효한 유튜브 URL/ID가 아닙니다." as const };
  }
  return {
    row: {
      title: input.title,
      scripture: input.scripture || null,
      preacher: input.preacher,
      youtube_id,
      summary: input.summary || null,
      sermon_date: input.sermon_date,
    },
    error: null,
  };
}

export async function createSermon(input: AdminSermonInput): Promise<Result> {
  const parsed = adminSermonSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const transformed = toRow(parsed.data);
  if (transformed.error) return { ok: false, error: transformed.error };
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { data, error: insertError } = await supabase
    .from("sermons")
    .insert(transformed.row)
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };
  revalidatePath("/sermons");
  revalidatePath("/admin/sermons");
  return { ok: true, id: data.id };
}

export async function updateSermon(
  id: string,
  input: AdminSermonInput,
): Promise<Result> {
  const parsed = adminSermonSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const transformed = toRow(parsed.data);
  if (transformed.error) return { ok: false, error: transformed.error };
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("sermons")
    .update(transformed.row)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/sermons");
  revalidatePath(`/sermons/${id}`);
  revalidatePath("/admin/sermons");
  return { ok: true, id };
}

export async function deleteSermon(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("sermons")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/sermons");
  revalidatePath("/admin/sermons");
  return { ok: true };
}

export async function bulkDeleteSermons(
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
    .from("sermons")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/sermons");
  revalidatePath("/admin/sermons");
  return { ok: true, deleted: ids.length };
}

export async function publishSermon(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("sermons")
    .update({ is_draft: false })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/sermons");
  revalidatePath(`/sermons/${id}`);
  revalidatePath("/admin/sermons");
  revalidatePath("/admin");
  return { ok: true, id };
}

export async function unpublishSermon(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("sermons")
    .update({ is_draft: true })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/sermons");
  revalidatePath(`/sermons/${id}`);
  revalidatePath("/admin/sermons");
  revalidatePath("/admin");
  return { ok: true, id };
}

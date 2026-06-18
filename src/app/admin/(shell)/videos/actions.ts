"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  adminVideoSchema,
  extractYoutubeId,
  type AdminVideoInput,
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

function toRow(input: AdminVideoInput) {
  const youtube_id = extractYoutubeId(input.youtube_url);
  if (!youtube_id) {
    return { error: "유효한 유튜브 URL/ID가 아닙니다." as const };
  }
  return {
    row: {
      title: input.title,
      youtube_id,
      description: input.description || null,
      performer: input.performer || null,
      video_date: input.video_date,
    },
    error: null,
  };
}

export async function createVideo(input: AdminVideoInput): Promise<Result> {
  const parsed = adminVideoSchema.safeParse(input);
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
    .from("videos")
    .insert(transformed.row)
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  return { ok: true, id: data.id };
}

export async function updateVideo(
  id: string,
  input: AdminVideoInput,
): Promise<Result> {
  const parsed = adminVideoSchema.safeParse(input);
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
    .from("videos")
    .update(transformed.row)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/videos");
  revalidatePath(`/videos/${id}`);
  revalidatePath("/admin/videos");
  return { ok: true, id };
}

export async function deleteVideo(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("videos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  return { ok: true };
}

export async function bulkDeleteVideos(
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
    .from("videos")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  return { ok: true, deleted: ids.length };
}

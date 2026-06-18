"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminNoticeSchema, type AdminNoticeInput } from "@/lib/forms/admin-schemas";

type Result = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

export async function createNotice(input: AdminNoticeInput): Promise<Result> {
  const parsed = adminNoticeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { data, error: insertError } = await supabase
    .from("notices")
    .insert({ ...parsed.data, is_draft: parsed.data.is_draft ?? false })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };
  revalidatePath("/notices");
  revalidatePath("/schedules");
  revalidatePath("/admin/notices");
  return { ok: true, id: data.id };
}

export async function updateNotice(id: string, input: AdminNoticeInput): Promise<Result> {
  const parsed = adminNoticeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { is_draft, ...rest } = parsed.data;
  const update: Partial<{
    title: string;
    content: string;
    is_pinned: boolean;
    category: AdminNoticeInput["category"];
    is_draft: boolean;
    updated_at: string;
  }> = { ...rest, updated_at: new Date().toISOString() };
  if (is_draft !== undefined) update.is_draft = is_draft;
  const { error: updateError } = await supabase
    .from("notices")
    .update(update)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/notices");
  revalidatePath(`/notices/${id}`);
  revalidatePath("/admin/notices");
  return { ok: true, id };
}

export async function deleteNotice(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("notices")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/notices");
  revalidatePath("/schedules");
  revalidatePath("/admin/notices");
  return { ok: true };
}

export async function deleteNoticeAndRedirect(id: string): Promise<Result> {
  const result = await deleteNotice(id);
  if (!result.ok) return result;
  redirect("/admin/notices");
}

export async function bulkDeleteNotices(
  formData: FormData,
): Promise<Result & { deleted?: number }> {
  const ids = formData
    .getAll("ids")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  if (ids.length === 0) {
    return { ok: false, error: "삭제할 글을 선택해 주세요." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("notices")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/notices");
  revalidatePath("/schedules");
  revalidatePath("/admin/notices");
  return { ok: true, deleted: ids.length };
}

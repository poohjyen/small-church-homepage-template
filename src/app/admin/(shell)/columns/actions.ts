"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  adminColumnSchema,
  type AdminColumnInput,
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

export async function createColumn(input: AdminColumnInput): Promise<Result> {
  const parsed = adminColumnSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { data, error: insertError } = await supabase
    .from("pastoral_columns")
    .insert(parsed.data)
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };
  revalidatePath("/columns");
  revalidatePath("/admin/columns");
  return { ok: true, id: data.id };
}

export async function updateColumn(
  id: string,
  input: AdminColumnInput,
): Promise<Result> {
  const parsed = adminColumnSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("pastoral_columns")
    .update(parsed.data)
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/columns");
  revalidatePath(`/columns/${id}`);
  revalidatePath("/admin/columns");
  return { ok: true, id };
}

export async function deleteColumn(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("pastoral_columns")
    .delete()
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/columns");
  revalidatePath("/admin/columns");
  return { ok: true };
}

export async function bulkDeleteColumns(
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
    .from("pastoral_columns")
    .delete()
    .in("id", ids);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidatePath("/columns");
  revalidatePath("/admin/columns");
  return { ok: true, deleted: ids.length };
}

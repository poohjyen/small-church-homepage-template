"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormStatus } from "@/types/database";

type Result = { ok: true } | { ok: false; error: string };

const FORM_STATUS_VALUES: [FormStatus, ...FormStatus[]] = [
  "new",
  "contacted",
  "completed",
  "archived",
];

const updateSchema = z.object({
  id: z.string().uuid("잘못된 ID입니다."),
  status: z.enum(FORM_STATUS_VALUES),
  admin_memo: z.string().trim().max(2000),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

async function updateRow(
  table:
    | "newcomer_forms"
    | "prayer_requests"
    | "visit_requests"
    | "donation_receipts",
  input: unknown,
  revalidate: string,
): Promise<Result> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { id, status, admin_memo } = parsed.data;
  const { error: updateError } = await supabase
    .from(table)
    .update({ status, admin_memo: admin_memo || null })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath(revalidate);
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateNewcomerSubmission(input: unknown): Promise<Result> {
  return updateRow("newcomer_forms", input, "/admin/forms/newcomer");
}

export async function updatePrayerSubmission(input: unknown): Promise<Result> {
  return updateRow("prayer_requests", input, "/admin/forms/prayer");
}

export async function updateVisitSubmission(input: unknown): Promise<Result> {
  return updateRow("visit_requests", input, "/admin/forms/visit");
}

export async function updateDonationReceiptSubmission(
  input: unknown,
): Promise<Result> {
  return updateRow(
    "donation_receipts",
    input,
    "/admin/forms/donation-receipt",
  );
}

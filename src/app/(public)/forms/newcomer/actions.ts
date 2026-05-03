"use server";

import { createClient } from "@/lib/supabase/server";
import { newcomerSchema, type NewcomerInput } from "@/lib/forms/schemas";
import { sendAdminNotification, row, wrapTable } from "@/lib/email/resend";
import { CHURCH } from "../../../../../church.config";

type Result = { ok: true } | { ok: false; error: string };

export async function submitNewcomer(input: NewcomerInput): Promise<Result> {
  const parsed = newcomerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const v = parsed.data;
  const supabase = await createClient();
  const { error: insertError } = await supabase.from("newcomer_forms").insert({
    name: v.name,
    phone: v.phone,
    birthdate: v.birthdate?.trim() ? v.birthdate : null,
    address: v.address?.trim() ? v.address : null,
    family_info: v.family_info?.trim() ? v.family_info : null,
    visit_reason: v.visit_reason?.trim() ? v.visit_reason : null,
    previous_church: v.previous_church?.trim() ? v.previous_church : null,
    admin_memo: null,
  });
  if (insertError) return { ok: false, error: insertError.message };

  const rows =
    row("성함", v.name) +
    row("연락처", v.phone) +
    row("생년월일", v.birthdate ?? null) +
    row("주소", v.address ?? null) +
    row("가족관계", v.family_info ?? null) +
    row("방문 계기", v.visit_reason ?? null) +
    row("이전 교회", v.previous_church ?? null);
  await sendAdminNotification({
    subject: `[${CHURCH.name}] 새가족 등록 신청 — ${v.name}`,
    html: wrapTable("새가족 등록 신청", rows),
  });

  return { ok: true };
}

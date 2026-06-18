"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { visitSchema, type VisitInput } from "@/lib/forms/schemas";
import { sendAdminNotification, row, wrapTable } from "@/lib/email/resend";
import { CHURCH } from "../../../../../church.config";

type Result = { ok: true } | { ok: false; error: string };

export async function submitVisit(input: VisitInput): Promise<Result> {
  const parsed = visitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const captcha = await verifyTurnstile(parsed.data.turnstile_token);
  if (!captcha.ok) return { ok: false, error: captcha.error };
  const v = parsed.data;
  const supabase = await createClient();
  const { error: insertError } = await supabase.from("visit_requests").insert({
    name: v.name,
    phone: v.phone,
    address: v.address,
    requested_date: v.requested_date?.trim() ? v.requested_date : null,
    requested_time: v.requested_time?.trim() ? v.requested_time : null,
    reason: v.reason?.trim() ? v.reason : null,
    admin_memo: null,
  });
  if (insertError) return { ok: false, error: insertError.message };

  const rows =
    row("성함", v.name) +
    row("연락처", v.phone) +
    row("주소", v.address) +
    row("희망 날짜", v.requested_date ?? null) +
    row("희망 시간", v.requested_time ?? null) +
    row("심방 사유", v.reason ?? null);
  await sendAdminNotification({
    subject: `[${CHURCH.name}] 심방 요청 — ${v.name}`,
    html: wrapTable("심방 요청", rows),
  });

  return { ok: true };
}

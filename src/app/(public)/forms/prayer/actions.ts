"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { prayerSchema, type PrayerInput } from "@/lib/forms/schemas";
import { sendAdminNotification, row, wrapTable } from "@/lib/email/resend";
import { CHURCH } from "../../../../../church.config";

type Result = { ok: true } | { ok: false; error: string };

export async function submitPrayer(input: PrayerInput): Promise<Result> {
  const parsed = prayerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const captcha = await verifyTurnstile(parsed.data.turnstile_token);
  if (!captcha.ok) return { ok: false, error: captcha.error };
  const v = parsed.data;
  const isAnonymous = v.is_anonymous;
  const supabase = await createClient();
  const { error: insertError } = await supabase.from("prayer_requests").insert({
    is_anonymous: isAnonymous,
    name: isAnonymous ? null : (v.name?.trim() || null),
    phone: isAnonymous ? null : (v.phone?.trim() || null),
    content: v.content,
    admin_memo: null,
  });
  if (insertError) return { ok: false, error: insertError.message };

  const displayName = isAnonymous ? "(익명)" : (v.name ?? "");
  const rows =
    row("이름", displayName) +
    row("연락처", isAnonymous ? "—" : (v.phone ?? null)) +
    row("기도제목", v.content);
  await sendAdminNotification({
    subject: `[${CHURCH.name}] 기도제목 — ${displayName}`,
    html: wrapTable("기도제목 접수", rows),
  });

  return { ok: true };
}

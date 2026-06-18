"use server";

import { createClient } from "@/lib/supabase/server";
import {
  donationReceiptSchema,
  type DonationReceiptInput,
} from "@/lib/forms/schemas";
import { sendAdminNotification, row, wrapTable } from "@/lib/email/resend";
import { CHURCH } from "../../../../../church.config";

type Result = { ok: true } | { ok: false; error: string };

const DELIVERY_LABEL: Record<DonationReceiptInput["delivery_method"], string> = {
  pickup: "교회에서 수령",
  email: "이메일 수령",
  fax: "팩스 수령",
};

export async function submitDonationReceipt(
  input: DonationReceiptInput,
): Promise<Result> {
  const parsed = donationReceiptSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다.",
    };
  }
  const v = parsed.data;
  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("donation_receipts")
    .insert({
      name: v.name,
      birthdate: v.birthdate,
      phone: v.phone,
      address: v.address,
      delivery_method: v.delivery_method,
      delivery_email:
        v.delivery_method === "email" ? v.delivery_email?.trim() || null : null,
      delivery_fax:
        v.delivery_method === "fax" ? v.delivery_fax?.trim() || null : null,
      note: v.note?.trim() ? v.note : null,
      admin_memo: null,
    });
  if (insertError) return { ok: false, error: insertError.message };

  const rows =
    row("성함", v.name) +
    row("생년월일", v.birthdate) +
    row("휴대폰", v.phone) +
    row("주소", v.address) +
    row("수령방법", DELIVERY_LABEL[v.delivery_method]) +
    (v.delivery_method === "email" ? row("이메일", v.delivery_email ?? null) : "") +
    (v.delivery_method === "fax" ? row("팩스", v.delivery_fax ?? null) : "") +
    row("기타요청", v.note ?? null);
  await sendAdminNotification({
    subject: `[${CHURCH.name}] 기부금 영수증 신청 — ${v.name}`,
    html: wrapTable("기부금 영수증 신청", rows),
  });

  return { ok: true };
}

import { z } from "zod";

const phoneRegex = /^[0-9-+\s()]{8,20}$/;
const phoneDigitsOk = (val: string) => (val.match(/\d/g)?.length ?? 0) >= 8;

const phoneRequired = z
  .string()
  .regex(phoneRegex, "연락처를 정확히 입력해 주세요.")
  .refine(phoneDigitsOk, "연락처를 정확히 입력해 주세요.");

const consent = z.boolean().refine((v) => v === true, {
  message: "개인정보 수집 동의가 필요합니다.",
});

export const newcomerSchema = z.object({
  name: z.string().min(2, "성함을 입력해 주세요.").max(50),
  phone: phoneRequired,
  birthdate: z.string().optional(),
  address: z.string().max(200).optional(),
  family_info: z.string().max(300).optional(),
  visit_reason: z.string().max(300).optional(),
  previous_church: z.string().max(100).optional(),
  consent,
  turnstile_token: z.string().optional(),
});
export type NewcomerInput = z.infer<typeof newcomerSchema>;

export const prayerSchema = z
  .object({
    is_anonymous: z.boolean(),
    name: z.string().max(50).optional(),
    phone: z.string().optional(),
    content: z.string().min(5, "기도제목을 입력해 주세요.").max(2000),
    consent,
    turnstile_token: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.is_anonymous) {
      if (!val.name || val.name.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["name"],
          message: "성함을 입력해 주세요.",
        });
      }
      if (val.phone && (!phoneRegex.test(val.phone) || !phoneDigitsOk(val.phone))) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "연락처 형식이 올바르지 않습니다.",
        });
      }
    }
  });
export type PrayerInput = z.infer<typeof prayerSchema>;

export const visitSchema = z.object({
  name: z.string().min(2, "성함을 입력해 주세요.").max(50),
  phone: phoneRequired,
  address: z.string().min(5, "주소를 입력해 주세요.").max(200),
  requested_date: z.string().optional(),
  requested_time: z.string().optional(),
  reason: z.string().max(500).optional(),
  consent,
  turnstile_token: z.string().optional(),
});
export type VisitInput = z.infer<typeof visitSchema>;

const faxRegex = /^[0-9-+\s()]{8,20}$/;

export const donationReceiptSchema = z
  .object({
    name: z.string().min(2, "성함을 입력해 주세요.").max(50),
    birthdate: z.string().min(1, "생년월일을 입력해 주세요."),
    phone: phoneRequired,
    address: z.string().min(5, "주소를 입력해 주세요.").max(200),
    delivery_method: z.enum(["pickup", "email", "fax"]),
    delivery_email: z.string().optional(),
    delivery_fax: z.string().optional(),
    note: z.string().max(500).optional(),
    consent,
    turnstile_token: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.delivery_method === "email") {
      const email = val.delivery_email?.trim() ?? "";
      if (!email) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery_email"],
          message: "이메일을 입력해 주세요.",
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery_email"],
          message: "올바른 이메일 형식이 아닙니다.",
        });
      }
    }
    if (val.delivery_method === "fax") {
      const fax = val.delivery_fax?.trim() ?? "";
      if (!fax) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery_fax"],
          message: "팩스번호를 입력해 주세요.",
        });
      } else if (!faxRegex.test(fax) || (fax.match(/\d/g)?.length ?? 0) < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["delivery_fax"],
          message: "팩스번호를 정확히 입력해 주세요.",
        });
      }
    }
  });
export type DonationReceiptInput = z.infer<typeof donationReceiptSchema>;

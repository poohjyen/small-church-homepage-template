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
});
export type NewcomerInput = z.infer<typeof newcomerSchema>;

export const prayerSchema = z
  .object({
    is_anonymous: z.boolean(),
    name: z.string().max(50).optional(),
    phone: z.string().optional(),
    content: z.string().min(5, "기도제목을 입력해 주세요.").max(2000),
    consent,
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
});
export type VisitInput = z.infer<typeof visitSchema>;

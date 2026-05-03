import { z } from "zod";

export const yearMottoSchema = z.object({
  year: z.coerce.number().int().min(2000).max(3000),
  motto: z.string().trim().min(1, "표어를 입력해 주세요.").max(200),
  scripture: z.string().trim().max(200),
  body: z.string().trim().max(2000),
});
export type YearMottoInput = z.infer<typeof yearMottoSchema>;

export const visionThreeSchema = z.object({
  v1: z.string().trim().min(1, "비전 1을 입력해 주세요.").max(100),
  v2: z.string().trim().min(1, "비전 2를 입력해 주세요.").max(100),
  v3: z.string().trim().min(1, "비전 3을 입력해 주세요.").max(100),
});
export type VisionThreeInput = z.infer<typeof visionThreeSchema>;

export const contactSchema = z.object({
  address: z.string().trim().min(1, "주소를 입력해 주세요.").max(200),
  phone: z.string().trim().min(1, "전화번호를 입력해 주세요.").max(50),
  account: z.string().trim().max(200),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const snsSchema = z.object({
  band: z.string().trim().max(500).or(z.literal("")),
  youtube: z.string().trim().max(500).or(z.literal("")),
  instagram: z.string().trim().max(500).or(z.literal("")),
});
export type SnsInput = z.infer<typeof snsSchema>;

export const adminEmailSchema = z.object({
  admin_email: z.string().trim().email("올바른 이메일을 입력해 주세요."),
});
export type AdminEmailInput = z.infer<typeof adminEmailSchema>;

export const pageHeroImagesSchema = z.record(
  z.string().min(1),
  z.string().trim().max(500),
);
export type PageHeroImagesInput = z.infer<typeof pageHeroImagesSchema>;

export const pastorGreetingSchema = z.object({
  name: z.string().trim().min(1, "담임목사 이름을 입력해 주세요.").max(50),
  photo_url: z.string().trim().max(500),
  body: z.string().trim().min(10, "인사말 본문을 입력해 주세요.").max(4000),
});
export type PastorGreetingInput = z.infer<typeof pastorGreetingSchema>;

const worshipAccentSchema = z.enum([
  "navy",
  "navy-dark",
  "navy-light",
  "teal",
  "amber",
]);

export const worshipSchedulesSchema = z.object({
  items: z
    .array(
      z.object({
        title: z.string().trim().min(1, "예배 이름을 입력해 주세요.").max(50),
        day: z.string().trim().min(1, "요일을 입력해 주세요.").max(10),
        time: z.string().trim().min(1, "시간을 입력해 주세요.").max(20),
        place: z.string().trim().min(1, "장소를 입력해 주세요.").max(50),
        accent: worshipAccentSchema,
      }),
    )
    .max(20),
});
export type WorshipSchedulesInput = z.infer<typeof worshipSchedulesSchema>;

export const dawnPrayersSchema = z.object({
  items: z
    .array(
      z.object({
        day: z.string().trim().min(1, "요일을 입력해 주세요.").max(10),
        topic: z.string().trim().min(1, "기도제목을 입력해 주세요.").max(200),
      }),
    )
    .max(10),
});
export type DawnPrayersInput = z.infer<typeof dawnPrayersSchema>;

export const offeringAccountsSchema = z.object({
  items: z
    .array(
      z.object({
        dept: z.string().trim().min(1, "부서명을 입력해 주세요.").max(30),
        account: z.string().trim().min(1, "계좌번호를 입력해 주세요.").max(100),
      }),
    )
    .max(10),
});
export type OfferingAccountsInput = z.infer<typeof offeringAccountsSchema>;

export const adminNameSchema = z.object({
  admin_name: z.string().trim().min(1, "이름을 입력해 주세요.").max(50),
});
export type AdminNameInput = z.infer<typeof adminNameSchema>;

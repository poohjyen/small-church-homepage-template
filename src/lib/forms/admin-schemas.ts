import { z } from "zod";

const trimmedMin = (label: string, min = 1) =>
  z.string().trim().min(min, `${label}을(를) 입력해 주세요.`);

// ───── Notices ─────
const NOTICE_CATEGORY_VALUES = ["news", "schedule"] as const;
export const NOTICE_CATEGORY_OPTIONS: {
  value: (typeof NOTICE_CATEGORY_VALUES)[number];
  label: string;
}[] = [
  { value: "news", label: "교회소식" },
  { value: "schedule", label: "교회일정" },
];

export const adminNoticeSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  content: trimmedMin("본문", 5).max(20000),
  is_pinned: z.boolean(),
  category: z.enum(NOTICE_CATEGORY_VALUES).default("news"),
});
export type AdminNoticeInput = z.infer<typeof adminNoticeSchema>;

// ───── Pastoral Columns ─────
export const adminColumnSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  author: trimmedMin("작성자").max(50),
  published_date: trimmedMin("발행일"),
  content: trimmedMin("본문", 5).max(20000),
});
export type AdminColumnInput = z.infer<typeof adminColumnSchema>;

// ───── Sermons ─────
const youtubeUrlOrId = z
  .string()
  .trim()
  .min(1, "유튜브 URL 또는 ID를 입력해 주세요.")
  .refine(
    (s) => extractYoutubeId(s) !== null,
    "유효한 유튜브 URL 또는 11자리 ID를 입력해 주세요.",
  );

export const adminSermonSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  scripture: z.string().trim().max(100).optional().or(z.literal("")),
  preacher: trimmedMin("설교자").max(50),
  youtube_url: youtubeUrlOrId,
  summary: z.string().trim().max(2000).optional().or(z.literal("")),
  sermon_date: trimmedMin("설교일"),
});
export type AdminSermonInput = z.infer<typeof adminSermonSchema>;

export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

// ───── Videos (특별영상) ─────
export const adminVideoSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  performer: z.string().trim().max(100).optional().or(z.literal("")),
  youtube_url: youtubeUrlOrId,
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  video_date: trimmedMin("게시일"),
});
export type AdminVideoInput = z.infer<typeof adminVideoSchema>;

// ───── Bulletins ─────
export const adminBulletinSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  bulletin_date: trimmedMin("주보 날짜"),
  pdf_url: z.string().trim().url("올바른 PDF URL이어야 합니다.").or(z.literal("")).optional(),
  attach_column: z.boolean(),
  column_title: z.string().trim().max(200).optional().or(z.literal("")),
  column_content: z.string().trim().max(20000).optional().or(z.literal("")),
}).superRefine((val, ctx) => {
  if (val.attach_column) {
    if (!val.column_title || val.column_title.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["column_title"],
        message: "칼럼 제목을 입력해 주세요.",
      });
    }
    if (!val.column_content || val.column_content.length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["column_content"],
        message: "칼럼 본문을 입력해 주세요.",
      });
    }
  }
});
export type AdminBulletinInput = z.infer<typeof adminBulletinSchema>;

// ───── Galleries ─────
const GALLERY_CATEGORY_VALUES = [
  "예배",
  "특별행사",
  "교회학교",
] as const;
export const GALLERY_CATEGORY_OPTIONS = GALLERY_CATEGORY_VALUES;

export const adminGallerySchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  category: z.enum(GALLERY_CATEGORY_VALUES, {
    message: "카테고리를 선택해 주세요.",
  }),
  event_date: z.string().trim().optional().or(z.literal("")),
});
export type AdminGalleryInput = z.infer<typeof adminGallerySchema>;

// ───── Resources ─────
const RESOURCE_CATEGORY_VALUES = [
  "신청서식",
  "소개자료",
  "교육자료",
  "회의록",
  "기타",
] as const;
export const RESOURCE_CATEGORY_OPTIONS = RESOURCE_CATEGORY_VALUES;

export const adminResourceSchema = z.object({
  title: trimmedMin("제목", 2).max(200),
  category: z.enum(RESOURCE_CATEGORY_VALUES, {
    message: "카테고리를 선택해 주세요.",
  }),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});
export type AdminResourceInput = z.infer<typeof adminResourceSchema>;

// ───── Site Popups ─────
const POPUP_POSITION_VALUES = [
  "center",
  "top-right",
  "bottom-right",
  "top-left",
  "bottom-left",
] as const;

export const adminPopupSchema = z
  .object({
    title: trimmedMin("관리용 제목").max(100),
    image_alt: z.string().trim().max(200).optional().or(z.literal("")),
    link_url: z
      .string()
      .trim()
      .url("클릭 링크는 http:// 또는 https://로 시작해야 합니다.")
      .optional()
      .or(z.literal("")),
    link_target: z.enum(["_self", "_blank"]).default("_self"),
    starts_at: trimmedMin("시작일"),
    ends_at: trimmedMin("종료일"),
    position: z.enum(POPUP_POSITION_VALUES).default("center"),
    width: z.number().int().min(200).max(1200).default(480),
    width_mobile: z.number().int().min(200).max(600).default(320),
    display_priority: z.number().int().min(0).max(9999).default(0),
    show_dont_show_today: z.boolean().default(true),
    show_close_button: z.boolean().default(true),
    is_active: z.boolean().default(true),
    pages: z.array(z.string().trim().min(1)).min(1).default(["/"]),
  })
  .refine(
    (v) => {
      const s = new Date(v.starts_at);
      const e = new Date(v.ends_at);
      return !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e > s;
    },
    { message: "종료일은 시작일보다 늦어야 합니다.", path: ["ends_at"] },
  );
export type AdminPopupInput = z.infer<typeof adminPopupSchema>;

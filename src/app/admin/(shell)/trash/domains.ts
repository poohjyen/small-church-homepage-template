import type { StorageBucket } from "@/lib/storage/paths";

export type TrashDomain = {
  key: string;
  table: string;
  label: string;
  titleField: string;
  publicPath: string;
  adminPath: string;
  bucket?: StorageBucket;
  fileFields?: string[];
};

export const TRASH_DOMAINS: TrashDomain[] = [
  {
    key: "bulletin",
    table: "bulletins",
    label: "주보",
    titleField: "title",
    publicPath: "/bulletins",
    adminPath: "/admin/bulletins",
    bucket: "bulletins",
    fileFields: ["pdf_url", "thumbnail_url"],
  },
  {
    key: "notice",
    table: "notices",
    label: "교회소식",
    titleField: "title",
    publicPath: "/notices",
    adminPath: "/admin/notices",
  },
  {
    key: "column",
    table: "pastoral_columns",
    label: "목양칼럼",
    titleField: "title",
    publicPath: "/columns",
    adminPath: "/admin/columns",
  },
  {
    key: "sermon",
    table: "sermons",
    label: "주일설교",
    titleField: "title",
    publicPath: "/sermons",
    adminPath: "/admin/sermons",
  },
  {
    key: "video",
    table: "videos",
    label: "특별영상",
    titleField: "title",
    publicPath: "/videos",
    adminPath: "/admin/videos",
  },
  {
    key: "gallery",
    table: "galleries",
    label: "갤러리",
    titleField: "title",
    publicPath: "/gallery",
    adminPath: "/admin/gallery",
    bucket: "gallery",
  },
  {
    key: "resource",
    table: "resources",
    label: "자료실",
    titleField: "title",
    publicPath: "/resources",
    adminPath: "/admin/resources",
    bucket: "resources",
    fileFields: ["file_url"],
  },
  {
    key: "hero",
    table: "hero_slides",
    label: "히어로 슬라이드",
    titleField: "title",
    publicPath: "/",
    adminPath: "/admin/hero",
    bucket: "hero",
    fileFields: ["image_url"],
  },
  {
    key: "popup",
    table: "site_popups",
    label: "팝업",
    titleField: "title",
    publicPath: "/",
    adminPath: "/admin/popups",
    bucket: "popups",
    fileFields: ["image_url"],
  },
  {
    key: "newcomer",
    table: "newcomer_forms",
    label: "새가족 등록",
    titleField: "name",
    publicPath: "/admin/forms/newcomer",
    adminPath: "/admin/forms/newcomer",
  },
  {
    key: "prayer",
    table: "prayer_requests",
    label: "기도제목",
    titleField: "name",
    publicPath: "/admin/forms/prayer",
    adminPath: "/admin/forms/prayer",
  },
  {
    key: "visit",
    table: "visit_requests",
    label: "심방 요청",
    titleField: "name",
    publicPath: "/admin/forms/visit",
    adminPath: "/admin/forms/visit",
  },
  {
    key: "donation_receipt",
    table: "donation_receipts",
    label: "기부금 영수증",
    titleField: "name",
    publicPath: "/admin/forms/donation-receipt",
    adminPath: "/admin/forms/donation-receipt",
  },
];

export const TRASH_RETENTION_DAYS = 14;

export function findDomain(key: string): TrashDomain | undefined {
  return TRASH_DOMAINS.find((d) => d.key === key);
}

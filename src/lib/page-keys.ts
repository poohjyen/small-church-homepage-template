// page_blocks 시스템에서 하드코딩된 페이지 / 동적 사용자 페이지 공용 메타

export const HARDCODED_PAGE_KEYS = [
  "missions",
  "about",
  "vision",
  "worship",
  "location",
] as const;

export type HardcodedPageKey = (typeof HARDCODED_PAGE_KEYS)[number];

export const HARDCODED_PAGE_META: Record<
  HardcodedPageKey,
  { label: string; publicHref: string; adminHref: string }
> = {
  missions: {
    label: "선교 페이지",
    publicHref: "/missions",
    adminHref: "/admin/missions",
  },
  about: {
    label: "인사말 추가",
    publicHref: "/about",
    adminHref: "/admin/about",
  },
  vision: {
    label: "비전 추가",
    publicHref: "/about/vision",
    adminHref: "/admin/vision",
  },
  worship: {
    label: "예배 추가",
    publicHref: "/about/worship",
    adminHref: "/admin/worship",
  },
  location: {
    label: "오시는 길 추가",
    publicHref: "/about/location",
    adminHref: "/admin/location",
  },
};

// 동적 페이지 슬러그 규칙: 소문자 시작, 영문/숫자/하이픈, 1~40자
export const SLUG_RE = /^[a-z][a-z0-9-]{0,40}$/;

export function isHardcodedPageKey(key: string): key is HardcodedPageKey {
  return (HARDCODED_PAGE_KEYS as readonly string[]).includes(key);
}

export function isValidPageKey(key: string): boolean {
  return isHardcodedPageKey(key) || SLUG_RE.test(key);
}

// 동적(custom) 페이지의 공개/관리 URL
export function customPagePublicHref(slug: string) {
  return `/pages/${slug}`;
}
export function customPageAdminHref(slug: string) {
  return `/admin/pages/${slug}`;
}

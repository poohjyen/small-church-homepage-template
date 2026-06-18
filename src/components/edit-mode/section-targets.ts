import type { LandingSectionKey } from "@/lib/landing-sections";

// 메인 페이지 각 영역 → 해당 영역을 고치는 관리자 화면
export type EditTarget = { href: string; label: string };

export const HERO_EDIT_TARGET: EditTarget = {
  href: "/admin/hero",
  label: "히어로 슬라이드",
};

export const LANDING_EDIT_TARGETS: Partial<
  Record<LandingSectionKey, EditTarget>
> = {
  greeting: { href: "/admin/settings", label: "인사·소개" },
  vision: { href: "/admin/settings", label: "비전·표어" },
  worship: { href: "/admin/settings", label: "예배 시간" },
  "featured-sermon": { href: "/admin/sermons", label: "이번 주 설교" },
  "sermons-quad": { href: "/admin/sermons", label: "설교·칼럼·소식·주보" },
  "gallery-strip": { href: "/admin/gallery", label: "갤러리" },
  "online-giving": { href: "/admin/settings", label: "온라인 헌금" },
  "mission-card": { href: "/admin/settings", label: "선교 카드" },
  location: { href: "/admin/settings", label: "오시는 길" },
  // quick-actions: 고정 바로가기(편집할 콘텐츠 없음) → 버튼 생략
};

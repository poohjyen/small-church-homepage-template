/**
 * 교회 홈페이지 설정 (Build-time 단일 진실의 소스)
 *
 * 이 파일은 setup-church Skill의 인터뷰가 끝나면 자동으로 채워집니다.
 * 직접 수정도 가능하지만, 다음 항목은 admin 페이지(/admin/settings)에서 변경하는 것을 권장합니다:
 * - 표어/비전/주소/전화/계좌/SNS → site_settings 테이블 (런타임 가변)
 *
 * 여기 들어가는 값은 빌드 시점에 코드/CSS/메타데이터에 박히는 것들입니다:
 * - 교회 정체성 (이름, 교단)
 * - 색상 토큰 (CSS 변수로 변환)
 * - 폰트 선택 (font import)
 * - 로고 경로
 * - SEO 기본값
 */

export type FontHeading = "gmarket-sans" | "noto-serif-kr" | "pretendard" | "spoqa-han-sans";
export type FontBody = "noto-sans-kr" | "pretendard" | "spoqa-han-sans";

export const CHURCH = {
  // ── 정체성 ────────────────────────────────────────────────────
  name: "샘플교회",
  fullName: "샘플교회",
  description: "예수 그리스도를 사랑하는 교회입니다.",
  pastorName: "홍길동 목사",
  pastorTitle: "담임목사",
  founded: "2024",
  denomination: "",

  // ── 자산 (apply-config가 SVG placeholder 자동 생성) ───────────
  logo: "/images/logo.svg",
  ogImage: "/images/og-image.svg",

  // ── 브랜드 색상 (globals.css의 CSS 변수와 1:1 매칭) ──────────
  brandColors: {
    primaryNavy: "#02567D",
    primaryNavyDark: "#013A57",
    primaryNavyLight: "#3A7FA0",
    secondarySky: "#0c9fa5",
    accentCoral: "#FF9084",
    accentAmber: "#F5A623",
  },

  // ── 폰트 프리셋 (apply-config가 layout.tsx의 import 교체) ────
  fonts: {
    heading: "gmarket-sans" as FontHeading,
    body: "noto-sans-kr" as FontBody,
  },

  // ── SEO 기본값 ───────────────────────────────────────────────
  seo: {
    keywords: ["교회", "예배", "설교"],
    googleVerification: "",
    naverVerification: "",
  },

  // ── 기본 연락처 (JSON-LD/메타데이터용 — 실제 표시는 site_settings 우선) ──
  defaults: {
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "KR",
    },
    telephone: [] as readonly string[],
    email: "",
    social: {
      band: "",
      youtube: "",
      instagram: "",
    },
  },
} as const;

export type ChurchConfig = typeof CHURCH;

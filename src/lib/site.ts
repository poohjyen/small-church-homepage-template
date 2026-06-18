import { CHURCH } from "../../church.config";

/**
 * SITE 객체 — 기존 코드와의 호환을 위한 어댑터.
 *
 * 새 코드는 `import { CHURCH } from "@/church.config"`를 직접 사용하는 것을 권장합니다.
 * 기존 코드는 SITE를 통해 동일한 값을 가져옵니다.
 *
 * 표시용 연락처(address, telephone, email)와 SNS 링크는 admin/site_settings에서
 * 관리되며, 여기 SITE.address 등은 JSON-LD/메타데이터의 빌드 타임 폴백입니다.
 */
export const SITE = {
  name: CHURCH.name,
  fullName: CHURCH.fullName,
  description: CHURCH.description,
  pastorName: CHURCH.pastorName,
  address: CHURCH.defaults.address,
  telephone: CHURCH.defaults.telephone,
  email: CHURCH.defaults.email,
  founded: CHURCH.founded,
  social: CHURCH.defaults.social,
  ogImage: CHURCH.ogImage,
  logo: CHURCH.logo,
} as const;

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && raw.startsWith("http")) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

/**
 * 인사말(greeting) 설정의 이름이 있으면 그것을, 없으면 church.config의 담임목사명을 반환.
 */
export function resolvePastorName(
  greeting: { name?: string | null } | null | undefined,
): string {
  return greeting?.name?.trim() || SITE.pastorName;
}

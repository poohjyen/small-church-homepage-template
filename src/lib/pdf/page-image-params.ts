// 주보 PDF → 페이지 이미지 변환 파라미터 (순수 계산 — render-pdf-pages.ts에서 사용)

export const MAX_PAGES = 30;
export const TARGET_WIDTH = 1600;
export const MAX_DIMENSION = 4096; // iOS Safari 캔버스 메모리 제한 대비
export const WEBP_QUALITY = 0.82;
export const JPEG_QUALITY = 0.85;

/** 페이지 원본 크기(pt) 기준 렌더 스케일: 폭 1600px 타깃, 한 변 4096px 상한, 최소 1 */
export function computeRenderScale(
  baseWidth: number,
  baseHeight: number,
): number {
  const byWidth = TARGET_WIDTH / baseWidth;
  const byMax = MAX_DIMENSION / Math.max(baseWidth, baseHeight);
  return Math.max(1, Math.min(byWidth, byMax));
}

/** 0-기반 페이지 인덱스 → "page-01.webp" 형식 파일명 */
export function pageImageFileName(index: number, mime: string): string {
  const ext = mime === "image/webp" ? "webp" : "jpg";
  return `page-${String(index + 1).padStart(2, "0")}.${ext}`;
}

// 랜딩 페이지 섹션 키 / 라벨 / 정렬·노출 정규화

export const LANDING_SECTION_KEYS = [
  "greeting",
  "vision",
  "featured-sermon",
  "sermons-quad",
  "gallery-strip",
  "quick-actions",
  "online-giving",
  "location",
] as const;

export type LandingSectionKey = (typeof LANDING_SECTION_KEYS)[number];

export const LANDING_SECTION_LABELS: Record<LandingSectionKey, string> = {
  greeting: "인사·소개 허브",
  vision: "교회 비전 카드",
  "featured-sermon": "이번 주 설교 영상",
  "sermons-quad": "콘텐츠 4분할 (설교/칼럼/소식/주보)",
  "gallery-strip": "갤러리 스트립",
  "quick-actions": "신청 바로가기 (새가족/기도제목/심방)",
  "online-giving": "온라인 헌금 안내",
  location: "오시는 길",
};

export type LandingSectionConfig = {
  key: LandingSectionKey;
  visible: boolean;
};

export const DEFAULT_LANDING_SECTIONS: LandingSectionConfig[] =
  LANDING_SECTION_KEYS.map((key) => ({ key, visible: true }));

export function isLandingSectionKey(value: unknown): value is LandingSectionKey {
  return (
    typeof value === "string" &&
    (LANDING_SECTION_KEYS as readonly string[]).includes(value)
  );
}

// 저장된 값을 기본값과 병합해 항상 8개 키를 모두 포함시키고 중복 제거
export function normalizeLandingSections(
  stored: unknown,
): LandingSectionConfig[] {
  const result: LandingSectionConfig[] = [];
  const seen = new Set<LandingSectionKey>();

  const items =
    stored && typeof stored === "object" && "items" in stored
      ? (stored as { items: unknown }).items
      : stored;

  if (Array.isArray(items)) {
    for (const raw of items) {
      if (!raw || typeof raw !== "object") continue;
      const key = (raw as { key?: unknown }).key;
      const visible = (raw as { visible?: unknown }).visible;
      if (!isLandingSectionKey(key)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ key, visible: visible !== false });
    }
  }

  for (const k of LANDING_SECTION_KEYS) {
    if (!seen.has(k)) result.push({ key: k, visible: true });
  }

  return result;
}

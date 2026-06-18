import { createClient } from "@/lib/supabase/server";
import type { VisitorStatsJson } from "@/types/database";

export type VisitorStats = Omit<
  VisitorStatsJson,
  "daily" | "topPages" | "topReferrers"
> & {
  hasData: boolean;
  daily: {
    date: string;
    label: string;
    weekday: string;
    views: number;
    visitors: number;
  }[];
  topPages: { path: string; label: string; views: number }[];
  topReferrers: { host: string; label: string; count: number }[];
};

const EMPTY: VisitorStats = {
  hasData: false,
  daily: [],
  today: { views: 0, visitors: 0 },
  yesterday: { views: 0, visitors: 0 },
  last7: { views: 0, visitors: 0 },
  topPages: [],
  topReferrers: [],
  devices: { pc: 0, mobile: 0, tablet: 0, unknown: 0 },
  total: 0,
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 경로 → 사람이 읽기 쉬운 이름. 접두사 매칭으로 상세 페이지까지 묶는다.
const PATH_LABELS: { prefix: string; label: string }[] = [
  { prefix: "/sermons", label: "주일설교" },
  { prefix: "/bulletins", label: "주보" },
  { prefix: "/notices", label: "교회소식" },
  { prefix: "/columns", label: "목양칼럼" },
  { prefix: "/videos", label: "특별영상" },
  { prefix: "/gallery", label: "갤러리" },
  { prefix: "/resources", label: "자료실" },
  { prefix: "/schedules", label: "교회일정" },
  { prefix: "/missions", label: "선교" },
  { prefix: "/about", label: "교회소개" },
  { prefix: "/forms/newcomer", label: "새가족 신청" },
  { prefix: "/forms/prayer", label: "기도제목" },
  { prefix: "/forms/visit", label: "심방 요청" },
  { prefix: "/forms/donation-receipt", label: "기부금 영수증" },
  { prefix: "/forms", label: "신청" },
];

function prettyPath(path: string): string {
  if (path === "/") return "홈";
  for (const { prefix, label } of PATH_LABELS) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return label;
  }
  return path;
}

const REFERRER_LABELS: { match: RegExp; label: string }[] = [
  { match: /naver\./, label: "네이버" },
  { match: /google\./, label: "구글" },
  { match: /daum\.|kakao\./, label: "다음·카카오" },
  { match: /youtube\.|youtu\.be/, label: "유튜브" },
  { match: /instagram\./, label: "인스타그램" },
  { match: /facebook\./, label: "페이스북" },
  { match: /band\.us/, label: "밴드" },
  { match: /bing\./, label: "Bing" },
];

function prettyReferrer(host: string): string {
  for (const { match, label } of REFERRER_LABELS) {
    if (match.test(host)) return label;
  }
  return host;
}

/** 관리자 대시보드용 최근 N일 방문자 통계. 실패 시 빈 통계 반환. */
export async function getVisitorStats(days = 7): Promise<VisitorStats> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_visitor_stats", { days });
    if (error || !data) return EMPTY;

    const raw = data as VisitorStatsJson;
    return {
      ...raw,
      hasData: (raw.total ?? 0) > 0,
      daily: (raw.daily ?? []).map((d) => {
        // d.date 는 "YYYY-MM-DD" (KST 기준) — 서버 시간대 영향 없이 직접 파싱
        const [y, m, day] = d.date.split("-").map(Number);
        const weekdayIdx = new Date(Date.UTC(y!, m! - 1, day!)).getUTCDay();
        return {
          ...d,
          label: `${m}/${day}`,
          weekday: WEEKDAYS[weekdayIdx] ?? "",
        };
      }),
      topPages: (raw.topPages ?? []).map((p) => ({
        ...p,
        label: prettyPath(p.path),
      })),
      topReferrers: (raw.topReferrers ?? []).map((r) => ({
        ...r,
        label: prettyReferrer(r.host),
      })),
    };
  } catch {
    return EMPTY;
  }
}

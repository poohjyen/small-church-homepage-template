// 주보 AI 자동 채우기 — 교회소식/교회일정 본문 조립 (plain text, whitespace-pre-wrap 렌더 전제)

function parseYearMonth(bulletinDate: string): { year: number; month: number } | null {
  const m = bulletinDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) };
}

export function formatNoticeTitle(bulletinDate: string): string {
  const m = bulletinDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "이번 주 교회소식";
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  let nth = 0;
  for (let i = 1; i <= day; i++) {
    if (new Date(year, month - 1, i).getDay() === 0) nth++;
  }
  if (nth < 1) nth = 1;
  return `${month}월 ${nth}주 교회소식`;
}

export function formatNoticeContent(
  items: string[],
  memberNews: string[] = [],
): string {
  const numbered = items
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n\n");
  const news = memberNews.map((s) => s.trim()).filter(Boolean);
  if (news.length === 0) return numbered;
  const section = `◈ 교우소식 ◈\n${news.map((s) => `· ${s}`).join("\n")}`;
  return numbered ? `${numbered}\n\n${section}` : section;
}

export function formatScheduleTitle(bulletinDate: string): string {
  const ym = parseYearMonth(bulletinDate);
  if (!ym) return "이번 달 교회일정";
  return `${ym.month}월의 교회일정`;
}

export function formatScheduleContent(input: {
  bulletinDate: string;
  motto?: string;
  events?: string[];
  volunteers?: string;
}): string {
  const ym = parseYearMonth(input.bulletinDate);
  const parts: string[] = [];

  const motto = input.motto?.trim();
  if (motto) {
    parts.push(
      ym ? `${ym.year}년 ${ym.month}월의 표어 — ${motto}` : `이달의 표어 — ${motto}`,
    );
  }

  const events = (input.events ?? []).map((e) => e.trim()).filter(Boolean);
  if (events.length > 0) {
    parts.push(`▶ 주요일정\n${events.map((e) => `· ${e}`).join("\n")}`);
  }

  const volunteers = input.volunteers?.trim();
  if (volunteers) {
    const heading = ym ? `▶ ${ym.month}월 예배 및 봉사위원` : "▶ 예배 및 봉사위원";
    parts.push(`${heading}\n${volunteers}`);
  }

  return parts.join("\n\n");
}

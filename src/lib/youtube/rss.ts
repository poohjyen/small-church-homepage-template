// 유튜브 재생목록 RSS 피드 파싱 + 행 변환 (순수 함수 — API 키 불필요)
// 피드: https://www.youtube.com/feeds/videos.xml?playlist_id=... (최근 15개 노출)

export type FeedEntry = {
  videoId: string;
  title: string;
  published: string;
};

export type SermonInsertRow = {
  title: string;
  scripture: string | null;
  preacher: string;
  youtube_id: string;
  summary: null;
  sermon_date: string;
  is_draft: boolean;
};

export type VideoInsertRow = {
  title: string;
  youtube_id: string;
  description: null;
  performer: null;
  video_date: string;
};

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = m[1];
    const videoId = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = block.match(/<title>([^<]*)<\/title>/)?.[1];
    const published = block.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!videoId || title === undefined || !published) continue;
    entries.push({
      videoId: videoId.trim(),
      title: decodeXmlEntities(title).trim(),
      published: published.trim(),
    });
  }
  return entries;
}

/** 선두 "[태그] " 1개 제거. 결과가 비면 원문 유지. */
function stripLeadingTag(raw: string): string {
  const stripped = raw.replace(/^\[[^\]]*\]\s*/, "").trim();
  return stripped || raw.trim();
}

// "신명기 6:4~15", "시편 23편", "마가복음 15:21~28" 류 — 한글 책명 + 장(:절)(~범위)
const SCRIPTURE_RE = /^[가-힣0-9]+(\s*[상하])?\s*\d+(?:[:장]\s*\d+)?(?:\s*[~-]\s*\d+(?::\d+)?)?(?:절|편|장)?$/;

/**
 * 채널 영상 제목 형식 "[주일예배] 제목 - 성경구절 | 설교자" 분해.
 * 형식이 어긋나면 해당 부분만 폴백 (preacher=default, scripture=null, title=원문).
 */
export function parseSermonTitle(
  raw: string,
  defaultPreacher: string,
): { title: string; scripture: string | null; preacher: string } {
  let rest = stripLeadingTag(raw);
  let preacher = defaultPreacher;
  let scripture: string | null = null;

  const pipeIdx = rest.lastIndexOf(" | ");
  if (pipeIdx > 0) {
    const right = rest.slice(pipeIdx + 3).trim();
    if (right) {
      preacher = right;
      rest = rest.slice(0, pipeIdx).trim();
    }
  }

  const dashIdx = rest.lastIndexOf(" - ");
  if (dashIdx > 0) {
    const right = rest.slice(dashIdx + 3).trim();
    if (SCRIPTURE_RE.test(right)) {
      scripture = right;
      rest = rest.slice(0, dashIdx).trim();
    }
  }

  const title = (rest || raw.trim()).slice(0, 200);
  return { title, scripture, preacher: preacher.slice(0, 100) };
}

export function parseVideoTitle(raw: string): string {
  return stripLeadingTag(raw).slice(0, 200);
}

export function filterNewEntries(
  entries: FeedEntry[],
  existingYoutubeIds: Set<string>,
): FeedEntry[] {
  return entries.filter((e) => !existingYoutubeIds.has(e.videoId));
}

export function entryToSermonRow(
  entry: FeedEntry,
  defaultPreacher: string,
): SermonInsertRow {
  const parsed = parseSermonTitle(entry.title, defaultPreacher);
  return {
    title: parsed.title,
    scripture: parsed.scripture,
    preacher: parsed.preacher,
    youtube_id: entry.videoId,
    summary: null,
    sermon_date: entry.published.slice(0, 10),
    is_draft: false,
  };
}

export function entryToVideoRow(entry: FeedEntry): VideoInsertRow {
  return {
    title: parseVideoTitle(entry.title),
    youtube_id: entry.videoId,
    description: null,
    performer: null,
    video_date: entry.published.slice(0, 10),
  };
}

const FEED_BASE = "https://www.youtube.com/feeds/videos.xml";

export async function fetchPlaylistFeed(
  playlistId: string,
): Promise<{ ok: true; entries: FeedEntry[] } | { ok: false; error: string }> {
  if (!playlistId.trim()) {
    return { ok: false, error: "재생목록 ID가 비어 있습니다." };
  }
  try {
    const res = await fetch(
      `${FEED_BASE}?playlist_id=${encodeURIComponent(playlistId.trim())}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: `유튜브 피드 오류 (${res.status}) — 재생목록 ID를 확인해 주세요.`,
      };
    }
    return { ok: true, entries: parseFeed(await res.text()) };
  } catch (e) {
    return {
      ok: false,
      error: `유튜브 피드 요청 실패: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

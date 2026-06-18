import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  entryToSermonRow,
  entryToVideoRow,
  fetchPlaylistFeed,
  filterNewEntries,
  type FeedEntry,
} from "./rss";

export type SyncResult =
  | { ok: true; found: number; inserted: number }
  | { ok: false; error: string };

/**
 * 유튜브 자동 동기화 활성 여부. YOUTUBE_API_KEY 환경변수가 있어야 동작한다.
 * 키가 없으면 기능 전체가 비활성(no-op) — 안전하게 "미설정" 상태로 안내한다.
 */
export function isYoutubeSyncConfigured(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY?.trim());
}

/** YOUTUBE_API_KEY 미설정 시 반환할 안내 메시지. */
export const YOUTUBE_NOT_CONFIGURED_MESSAGE =
  "유튜브 API 키가 설정되지 않았습니다.";

/** 피드 entries 중 table에 없는 youtube_id만 골라낸다. */
async function pickNewEntries(
  table: "sermons" | "videos",
  entries: FeedEntry[],
): Promise<{ ok: true; entries: FeedEntry[] } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const { data: existing, error } = await supabase
    .from(table)
    .select("youtube_id")
    .in(
      "youtube_id",
      entries.map((e) => e.videoId),
    );
  if (error) {
    return { ok: false, error: `기존 ${table} 조회 실패: ${error.message}` };
  }
  const existingSet = new Set((existing ?? []).map((r) => r.youtube_id));
  return { ok: true, entries: filterNewEntries(entries, existingSet) };
}

/**
 * 유튜브 재생목록 RSS에서 영상을 가져와 sermons에 없는 것만 공개 상태로 insert.
 * 제목 형식 "[주일예배] 제목 - 성경구절 | 설교자"를 파싱해 필드를 채운다.
 * YOUTUBE_API_KEY 미설정 시 아무것도 하지 않고 안내 메시지를 반환한다.
 */
export async function syncSermonPlaylist(
  playlistId: string,
  defaultPreacher: string,
): Promise<SyncResult> {
  if (!isYoutubeSyncConfigured()) {
    return { ok: false, error: YOUTUBE_NOT_CONFIGURED_MESSAGE };
  }
  const feed = await fetchPlaylistFeed(playlistId);
  if (!feed.ok) return feed;
  const found = feed.entries.length;
  if (found === 0) return { ok: true, found: 0, inserted: 0 };

  const picked = await pickNewEntries("sermons", feed.entries);
  if (!picked.ok) return picked;
  if (picked.entries.length === 0) return { ok: true, found, inserted: 0 };

  const rows = picked.entries.map((e) => entryToSermonRow(e, defaultPreacher));
  const supabase = createAdminClient();
  const { error } = await supabase.from("sermons").insert(rows);
  if (error) return { ok: false, error: `DB insert 실패: ${error.message}` };
  return { ok: true, found, inserted: rows.length };
}

/**
 * 유튜브 재생목록 RSS에서 영상을 가져와 videos(특별영상)에 없는 것만 insert.
 * category·display_order는 DB 기본값 사용.
 * YOUTUBE_API_KEY 미설정 시 아무것도 하지 않고 안내 메시지를 반환한다.
 */
export async function syncVideoPlaylist(playlistId: string): Promise<SyncResult> {
  if (!isYoutubeSyncConfigured()) {
    return { ok: false, error: YOUTUBE_NOT_CONFIGURED_MESSAGE };
  }
  const feed = await fetchPlaylistFeed(playlistId);
  if (!feed.ok) return feed;
  const found = feed.entries.length;
  if (found === 0) return { ok: true, found: 0, inserted: 0 };

  const picked = await pickNewEntries("videos", feed.entries);
  if (!picked.ok) return picked;
  if (picked.entries.length === 0) return { ok: true, found, inserted: 0 };

  const rows = picked.entries.map(entryToVideoRow);
  const supabase = createAdminClient();
  const { error } = await supabase.from("videos").insert(rows);
  if (error) return { ok: false, error: `DB insert 실패: ${error.message}` };
  return { ok: true, found, inserted: rows.length };
}

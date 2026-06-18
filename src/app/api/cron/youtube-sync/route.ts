import { revalidatePath } from "next/cache";

import { getSiteSetting } from "@/lib/data/site";
import {
  isYoutubeSyncConfigured,
  syncSermonPlaylist,
  syncVideoPlaylist,
} from "@/lib/youtube/sync";

export const dynamic = "force-dynamic";

type PartResult =
  | { skipped: true }
  | { ok: true; found: number; inserted: number }
  | { ok: false; error: string };

/**
 * 매일 1회 Vercel Cron이 호출 (vercel.json). CRON_SECRET env가 설정되어 있으면
 * Vercel이 Authorization: Bearer <CRON_SECRET> 헤더를 자동으로 붙여 보낸다.
 *
 * YOUTUBE_API_KEY 미설정 시에는 아무 동작도 하지 않고(no-op) 200을 반환한다.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // 유튜브 API 키가 없으면 기능 비활성 — 안전하게 no-op
  if (!isYoutubeSyncConfigured()) {
    return Response.json({ ok: true, skipped: "not-configured" }, { status: 200 });
  }

  let sermons: PartResult = { skipped: true };
  const sermonSetting = await getSiteSetting("youtube_sermon_sync");
  if (sermonSetting?.playlist_id) {
    sermons = await syncSermonPlaylist(
      sermonSetting.playlist_id,
      sermonSetting.default_preacher || "담임목사",
    );
    if (sermons.ok && sermons.inserted > 0) {
      revalidatePath("/sermons");
      revalidatePath("/admin/sermons");
      revalidatePath("/");
    }
  }

  let videos: PartResult = { skipped: true };
  const videoSetting = await getSiteSetting("youtube_video_sync");
  if (videoSetting?.playlist_id) {
    videos = await syncVideoPlaylist(videoSetting.playlist_id);
    if (videos.ok && videos.inserted > 0) {
      revalidatePath("/videos");
      revalidatePath("/admin/videos");
    }
  }

  const failed =
    ("ok" in sermons && !sermons.ok) || ("ok" in videos && !videos.ok);
  return Response.json(
    { ok: !failed, sermons, videos },
    { status: failed ? 500 : 200 },
  );
}

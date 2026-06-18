import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PageViewDevice } from "@/types/database";

// 방문자 통계 기록 엔드포인트.
// 클라이언트(PageViewTracker)가 페이지 진입 시 1회 호출 → page_views에 기록.
// 개인정보 비식별: 원본 IP를 저장하지 않고, "IP+UA+오늘날짜"의 단방향 해시만 저장한다.
// (같은 사람은 같은 날 같은 해시 → 방문자 수 집계 가능, 날짜가 바뀌면 추적 불가)

export const runtime = "nodejs";

function deviceFromUA(ua: string): PageViewDevice {
  const s = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))|kindle|silk|playbook/.test(s)) {
    return "tablet";
  }
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/.test(s)) {
    return "mobile";
  }
  if (s) return "pc";
  return "unknown";
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

function referrerHost(referrer: string | undefined, selfHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname;
    if (!host || host === selfHost) return null; // 사이트 내부 이동은 유입으로 치지 않음
    return host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      path?: unknown;
      referrer?: unknown;
    };
    const rawPath = typeof body.path === "string" ? body.path : "";
    if (!rawPath || !rawPath.startsWith("/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // 관리자/API 경로는 통계에서 제외
    const path = rawPath.split(/[?#]/)[0]!.slice(0, 300);
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return new NextResponse(null, { status: 204 });
    }

    const ua = req.headers.get("user-agent") ?? "";
    // 봇/크롤러는 집계 제외
    if (/bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview/i.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    // 한국시간(KST, UTC+9) 기준 날짜로 해시를 회전 → 통계 집계 일자 경계와 일치
    const today = new Date(Date.now() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const visitor_hash = createHash("sha256")
      .update(`${clientIp(req)}|${ua}|${today}|page-view`)
      .digest("hex")
      .slice(0, 32);

    const referrer =
      typeof body.referrer === "string" ? body.referrer : undefined;
    const selfHost = req.nextUrl.hostname;

    const supabase = createAdminClient();
    await supabase.from("page_views").insert({
      path,
      referrer_host: referrerHost(referrer, selfHost),
      device: deviceFromUA(ua),
      visitor_hash,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // 통계 기록 실패가 방문자 경험에 영향을 주지 않도록 조용히 무시
    return new NextResponse(null, { status: 204 });
  }
}

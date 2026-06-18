"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// 페이지 진입(및 클라이언트 라우팅 이동) 시 /api/track 에 1회 신호를 보낸다.
// 관리자 경로는 보내지 않으며, 실패해도 방문에 영향을 주지 않는다.
export function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/track", blob)) return;
    } catch {
      // sendBeacon 미지원 시 fetch로 폴백
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

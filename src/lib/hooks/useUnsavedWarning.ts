"use client";

import { useEffect } from "react";

/**
 * 입력 도중 페이지 이탈/새로고침 시 브라우저 기본 경고를 표시한다.
 * - dirty=true 일 때만 경고
 * - 모달/타입 안전한 client-side 라우팅 차단은 Next.js 한계로 brower beforeunload만 지원
 */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}

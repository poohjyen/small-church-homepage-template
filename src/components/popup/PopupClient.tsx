"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PopupPosition, SitePopup } from "@/types/database";

const STORAGE_KEY = "site_popup_dismissed_v1";

type DismissedMap = Record<string, number>;

function readDismissed(): DismissedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // ignore
  }
  return {};
}

function writeDismissed(next: DismissedMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore (private mode 등)
  }
}

const POSITION_CLASS: Record<PopupPosition, string> = {
  center: "fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4",
  "top-right": "fixed right-4 top-4 z-[60] md:right-6 md:top-6",
  "bottom-right": "fixed right-4 bottom-4 z-[60] md:right-6 md:bottom-6",
  "top-left": "fixed left-4 top-4 z-[60] md:left-6 md:top-6",
  "bottom-left": "fixed left-4 bottom-4 z-[60] md:left-6 md:bottom-6",
};

export function PopupClient({ popups }: { popups: SitePopup[] }) {
  // 위치별로 우선순위 가장 높은 1개만 노출
  const byPosition = useMemo(() => {
    const map = new Map<PopupPosition, SitePopup>();
    for (const p of popups) {
      if (!map.has(p.position)) map.set(p.position, p);
    }
    return Array.from(map.values());
  }, [popups]);

  const [hidden, setHidden] = useState<Set<string>>(new Set(byPosition.map((p) => p.id)));
  const [mounted, setMounted] = useState(false);

  // 초기엔 전부 숨김 → 마운트 후 localStorage를 읽어 dismissed 아닌 팝업만 노출.
  // localStorage는 서버에 없어 초기 렌더에서 읽으면 hydration mismatch가 나므로 의도적으로 마운트 후 1회만 읽는다.
  // (useSyncExternalStore로 바꾸면 서버 스냅샷=미해제 상태라 dismissed 팝업이 깜빡여 UX가 더 나빠짐 → 이 패턴 유지)
  useEffect(() => {
    const dismissed = readDismissed();
    const now = Date.now();
    const next = new Set<string>();
    for (const p of byPosition) {
      const until = dismissed[p.id];
      if (until && until > now) next.add(p.id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 1회 외부(localStorage) 읽기 (위 설명 참조)
    setHidden(next);
    setMounted(true);
  }, [byPosition]);

  function close(p: SitePopup, dontShowToday: boolean) {
    const dismissed = readDismissed();
    if (dontShowToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      dismissed[p.id] = tomorrow.getTime();
    } else {
      // 세션 한정 — 새 탭이면 다시 노출. 메모리 단위로만 숨김.
    }
    writeDismissed(dismissed);
    setHidden((prev) => {
      const next = new Set(prev);
      next.add(p.id);
      return next;
    });
  }

  // 첫 렌더는 숨김 (hydration mismatch 방지)
  if (!mounted) return null;

  return (
    <>
      {byPosition.map((p) => {
        if (hidden.has(p.id)) return null;
        return <Popup key={p.id} popup={p} onClose={close} />;
      })}
    </>
  );
}

function Popup({
  popup,
  onClose,
}: {
  popup: SitePopup;
  onClose: (p: SitePopup, dontShowToday: boolean) => void;
}) {
  const isCenter = popup.position === "center";
  const widthStyle = {
    "--popup-width": `${popup.width}px`,
    "--popup-width-mobile": `${popup.width_mobile}px`,
  } as React.CSSProperties;

  // ESC 닫기 (center 모달만)
  useEffect(() => {
    if (!isCenter) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(popup, false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCenter, popup, onClose]);

  const Image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={popup.image_url}
      alt={popup.image_alt ?? popup.title}
      className={cn("block h-auto w-full", popup.link_url ? "cursor-pointer" : "")}
    />
  );

  const ImageWrap = popup.link_url ? (
    <Link
      href={popup.link_url}
      target={popup.link_target}
      rel={popup.link_target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {Image}
    </Link>
  ) : (
    Image
  );

  return (
    <div
      className={POSITION_CLASS[popup.position]}
      role={isCenter ? "dialog" : undefined}
      aria-modal={isCenter ? true : undefined}
      aria-label={popup.image_alt ?? popup.title}
      onClick={isCenter ? () => onClose(popup, false) : undefined}
    >
      <div
        style={widthStyle}
        className={cn(
          "relative max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg bg-white shadow-2xl",
          "w-[var(--popup-width-mobile)] md:w-[var(--popup-width)]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {ImageWrap}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2 text-sm">
          {popup.show_dont_show_today ? (
            <button
              type="button"
              onClick={() => onClose(popup, true)}
              className="text-warm-gray hover:text-primary-navy"
            >
              오늘 하루 보지 않기
            </button>
          ) : (
            <span />
          )}
          {popup.show_close_button ? (
            <button
              type="button"
              onClick={() => onClose(popup, false)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-charcoal hover:bg-slate-100"
              aria-label="팝업 닫기"
            >
              닫기 <X className="size-3.5" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

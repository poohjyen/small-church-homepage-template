"use client";

import { Pencil, Eye } from "lucide-react";
import { useEditMode } from "./EditModeContext";

// 관리자에게만 보이는 우하단 플로팅 버튼. 누르면 편집 버튼 표시를 켜고 끈다.
export function EditModeToggle() {
  const { isAdmin, enabled, toggle } = useEditMode();
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className={[
        "fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full px-4 py-2.5",
        "text-sm font-semibold shadow-lg ring-1 transition",
        enabled
          ? "bg-primary-navy text-white ring-primary-navy/30 hover:bg-primary-navy/90"
          : "bg-white text-primary-navy ring-black/10 hover:ring-primary-navy/40",
      ].join(" ")}
    >
      {enabled ? (
        <>
          <Eye className="size-4" aria-hidden />
          편집 모드 끄기
        </>
      ) : (
        <>
          <Pencil className="size-4" aria-hidden />
          편집 모드
        </>
      )}
    </button>
  );
}

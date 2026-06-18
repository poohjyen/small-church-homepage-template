"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useEditMode } from "./EditModeContext";
import type { EditTarget } from "./section-targets";

// 메인 페이지 한 영역을 감싸, 편집 모드가 켜졌을 때 우상단에 "편집" 버튼을 띄운다.
// 관리자가 아니면 래퍼 없이 원본 그대로 렌더(일반 방문자에게 영향 없음).
export function SectionEditAnchor({
  target,
  children,
}: {
  target: EditTarget;
  children: React.ReactNode;
}) {
  const { isAdmin, enabled } = useEditMode();

  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative">
      {enabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 rounded-sm ring-2 ring-inset ring-primary-navy/30"
        />
      ) : null}
      {children}
      {enabled ? (
        <Link
          href={target.href}
          className="absolute right-3 top-3 z-50 inline-flex items-center gap-1.5 rounded-full bg-primary-navy/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/20 backdrop-blur transition hover:bg-primary-navy"
        >
          <Pencil className="size-3.5" aria-hidden />
          {target.label} 편집
        </Link>
      ) : null}
    </div>
  );
}

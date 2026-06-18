"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useEditMode } from "./EditModeContext";
import type { EditTarget } from "./section-targets";

// 단독 공개 페이지(교회소개 등)용 편집 버튼.
// 관리자가 편집 모드를 켰을 때만 상단 가운데에 떠서 해당 관리자 화면으로 보낸다.
// 자식을 감싸지 않으므로 페이지 어디에 두든 레이아웃에 영향 없음.
export function PageEditButton({ target }: { target: EditTarget }) {
  const { isAdmin, enabled } = useEditMode();
  if (!isAdmin || !enabled) return null;

  return (
    <Link
      href={target.href}
      className="fixed left-1/2 top-20 z-[55] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary-navy/95 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 backdrop-blur transition hover:bg-primary-navy"
    >
      <Pencil className="size-4" aria-hidden />이 페이지 편집 — {target.label}
    </Link>
  );
}

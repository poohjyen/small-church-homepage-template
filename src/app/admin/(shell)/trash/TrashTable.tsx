"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Undo2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { restoreItem, purgeItem } from "./actions";

export type TrashRow = {
  domainKey: string;
  domainLabel: string;
  id: string;
  title: string;
  deletedAt: string;
  daysLeft: number;
};

export function TrashTable({ rows }: { rows: TrashRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  function onRestore(r: TrashRow) {
    setBusy(r.id);
    startTransition(async () => {
      const res = await restoreItem(r.domainKey, r.id);
      setBusy(null);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`${r.domainLabel} "${r.title}"이(가) 복원되었습니다.`);
      router.refresh();
    });
  }

  function onPurge(r: TrashRow) {
    if (
      !confirm(
        `정말 영구 삭제할까요?\n\n${r.domainLabel}: "${r.title}"\n복구할 수 없습니다.`,
      )
    ) {
      return;
    }
    setBusy(r.id);
    startTransition(async () => {
      const res = await purgeItem(r.domainKey, r.id);
      setBusy(null);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("영구 삭제되었습니다.");
      router.refresh();
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-soft p-10 text-center text-warm-gray ring-1 ring-black/5">
        <Trash2 className="mx-auto size-10 text-warm-gray/50" aria-hidden />
        <p className="mt-3 text-sm">휴지통이 비어 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-black/5">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-soft text-left text-xs font-semibold uppercase tracking-wide text-warm-gray">
          <tr>
            <th className="px-4 py-3">유형</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3 whitespace-nowrap">삭제일</th>
            <th className="px-4 py-3 whitespace-nowrap">자동 삭제까지</th>
            <th className="px-4 py-3 text-right sticky right-0 z-20 bg-soft shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.12)]">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => {
            const itemBusy = busy === r.id;
            return (
              <tr key={`${r.domainKey}:${r.id}`} className="hover:bg-soft/40">
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="font-medium">
                    {r.domainLabel}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-charcoal">
                  <span className="line-clamp-2">{r.title || "(제목 없음)"}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-warm-gray">
                  {formatDate(r.deletedAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={
                      r.daysLeft <= 3
                        ? "font-medium text-red-600"
                        : "text-warm-gray"
                    }
                  >
                    {r.daysLeft <= 0
                      ? "곧 삭제"
                      : `${r.daysLeft}일 남음`}
                  </span>
                </td>
                <td className="px-4 py-3 sticky right-0 z-10 bg-white shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.12)]">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(r)}
                      disabled={pending || itemBusy}
                    >
                      <Undo2 className="size-3.5" aria-hidden /> 복원
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onPurge(r)}
                      disabled={pending || itemBusy}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5" aria-hidden /> 영구 삭제
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

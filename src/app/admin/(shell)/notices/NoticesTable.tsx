"use client";

import { useState } from "react";
import Link from "next/link";
import { Pin, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import type { Notice } from "@/types/database";
import { bulkDeleteNotices, deleteNotice } from "./actions";

type Props = {
  data: Notice[];
  hideCategory?: boolean;
};

const FORM_ID = "admin-notices-bulk";

export function NoticesTable({ data, hideCategory = false }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allChecked = data.length > 0 && selected.size === data.length;
  const someChecked = selected.size > 0 && selected.size < data.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(data.map((n) => n.id)));
  }

  function clear() {
    setSelected(new Set());
  }

  return (
    <>
      <form id={FORM_ID}>
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 px-3">
                  <input
                    type="checkbox"
                    aria-label="전체 선택"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked;
                    }}
                    onChange={toggleAll}
                    className="size-4 cursor-pointer accent-primary-navy"
                  />
                </TableHead>
                <TableHead className="w-10 px-2" />
                {hideCategory ? null : (
                  <TableHead className="w-24 px-4">분류</TableHead>
                )}
                <TableHead className="px-4">제목</TableHead>
                <TableHead className="w-32 px-4">작성일</TableHead>
                <TableHead className="w-24 px-4 text-right">조회수</TableHead>
                <TableHead className="w-32 px-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((n) => (
                <TableRow key={n.id} data-selected={selected.has(n.id)}>
                  <TableCell className="px-3">
                    <input
                      type="checkbox"
                      name="ids"
                      value={n.id}
                      aria-label={`${n.title} 선택`}
                      checked={selected.has(n.id)}
                      onChange={() => toggle(n.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </TableCell>
                  <TableCell className="px-2">
                    {n.is_pinned ? (
                      <Pin
                        className="size-4 text-primary-navy"
                        aria-label="상단 고정"
                      />
                    ) : null}
                  </TableCell>
                  {hideCategory ? null : (
                    <TableCell className="px-4">
                      <Badge
                        variant="outline"
                        className={
                          n.category === "schedule"
                            ? "border-secondary-sky/40 bg-secondary-sky/10 text-secondary-sky"
                            : "border-primary-navy/30 bg-primary-navy/10 text-primary-navy"
                        }
                      >
                        {n.category === "schedule" ? "교회일정" : "교회소식"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="max-w-[480px] truncate px-4 font-medium text-charcoal">
                    <Link
                      href={`/admin/notices/${n.id}/edit`}
                      className="hover:text-primary-navy hover:underline"
                    >
                      {n.title}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 text-warm-gray">
                    {format(parseISO(n.created_at), "yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="px-4 text-right tabular-nums text-warm-gray">
                    {n.view_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-warm-gray hover:text-primary-navy"
                        render={
                          <Link href={`/admin/notices/${n.id}/edit`}>
                            <Pencil className="size-4" aria-hidden />
                            <span className="sr-only">수정</span>
                          </Link>
                        }
                      />
                      <DeleteButton
                        itemLabel={n.title}
                        iconOnly
                        action={deleteNotice.bind(null, n.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </form>

      <BulkActionBar
        selectedCount={selected.size}
        onClear={clear}
        formId={FORM_ID}
        action={bulkDeleteNotices}
        itemLabel="글"
      />
    </>
  );
}

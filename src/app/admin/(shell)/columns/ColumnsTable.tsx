"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
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
import { previewBody } from "@/lib/data/helpers";
import type { PastoralColumn } from "@/types/database";
import { bulkDeleteColumns, deleteColumn } from "./actions";

const FORM_ID = "admin-columns-bulk";

export function ColumnsTable({ data }: { data: PastoralColumn[] }) {
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
    else setSelected(new Set(data.map((c) => c.id)));
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
                <TableHead className="px-4">제목 / 미리보기</TableHead>
                <TableHead className="w-32 px-4">작성자</TableHead>
                <TableHead className="w-32 px-4">발행일</TableHead>
                <TableHead className="w-32 px-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="px-3">
                    <input
                      type="checkbox"
                      name="ids"
                      value={c.id}
                      aria-label={`${c.title} 선택`}
                      checked={selected.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </TableCell>
                  <TableCell className="max-w-[520px] px-4 align-top">
                    <Link
                      href={`/admin/columns/${c.id}/edit`}
                      className="block font-medium text-charcoal hover:text-primary-navy hover:underline"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-1 truncate text-xs text-warm-gray">
                      {previewBody(c.content, 90)}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 text-warm-gray">{c.author}</TableCell>
                  <TableCell className="px-4 text-warm-gray">
                    {format(parseISO(c.published_date), "yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-warm-gray hover:text-primary-navy"
                        render={
                          <Link href={`/admin/columns/${c.id}/edit`}>
                            <Pencil className="size-4" aria-hidden />
                            <span className="sr-only">수정</span>
                          </Link>
                        }
                      />
                      <DeleteButton
                        itemLabel={c.title}
                        iconOnly
                        action={deleteColumn.bind(null, c.id)}
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
        action={bulkDeleteColumns}
        itemLabel="칼럼"
      />
    </>
  );
}

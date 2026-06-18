"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, FileText, ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { Bulletin } from "@/types/database";
import { bulkDeleteBulletins, deleteBulletin } from "./actions";

const FORM_ID = "admin-bulletins-bulk";

export function BulletinsTable({ data }: { data: Bulletin[] }) {
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
    else setSelected(new Set(data.map((b) => b.id)));
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
                <TableHead className="w-12 px-4">표지</TableHead>
                <TableHead className="px-4">제목</TableHead>
                <TableHead className="w-36 px-4">주보 날짜</TableHead>
                <TableHead className="w-32 px-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="px-3">
                    <input
                      type="checkbox"
                      name="ids"
                      value={b.id}
                      aria-label={`${b.title} 선택`}
                      checked={selected.has(b.id)}
                      onChange={() => toggle(b.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </TableCell>
                  <TableCell className="px-4">
                    {b.thumbnail_url ? (
                      <ImageIcon
                        className="size-5 text-secondary-sky"
                        aria-label="표지 있음"
                      />
                    ) : (
                      <FileText
                        className="size-5 text-primary-navy/70"
                        aria-hidden
                      />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[480px] truncate px-4 font-medium text-charcoal">
                    <Link
                      href={`/admin/bulletins/${b.id}/edit`}
                      className="hover:text-primary-navy hover:underline"
                    >
                      {b.title}
                    </Link>
                    {b.is_draft ? (
                      <Badge
                        variant="outline"
                        className="ml-2 border-amber-300 bg-amber-50 text-amber-700"
                      >
                        초안
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-4 text-warm-gray">
                    {format(parseISO(b.bulletin_date), "yyyy.MM.dd (EEE)")}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-warm-gray hover:text-primary-navy"
                        render={
                          <Link href={`/admin/bulletins/${b.id}/edit`}>
                            <Pencil className="size-4" aria-hidden />
                            <span className="sr-only">수정</span>
                          </Link>
                        }
                      />
                      <DeleteButton
                        itemLabel={b.title}
                        iconOnly
                        action={deleteBulletin.bind(null, b.id)}
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
        action={bulkDeleteBulletins}
        itemLabel="주보"
      />
    </>
  );
}

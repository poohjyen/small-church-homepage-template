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
import { youtubeThumb } from "@/lib/data/helpers";
import type { Sermon } from "@/types/database";
import { bulkDeleteSermons, deleteSermon } from "./actions";

const FORM_ID = "admin-sermons-bulk";

export function SermonsTable({ data }: { data: Sermon[] }) {
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
    else setSelected(new Set(data.map((s) => s.id)));
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
                <TableHead className="w-28 px-4">썸네일</TableHead>
                <TableHead className="px-4">제목 / 본문</TableHead>
                <TableHead className="w-32 px-4">설교일</TableHead>
                <TableHead className="w-32 px-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="px-3">
                    <input
                      type="checkbox"
                      name="ids"
                      value={s.id}
                      aria-label={`${s.title} 선택`}
                      checked={selected.has(s.id)}
                      onChange={() => toggle(s.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={youtubeThumb(s.youtube_id, "hq")}
                      alt=""
                      className="aspect-video w-24 rounded-md object-cover ring-1 ring-black/5"
                    />
                  </TableCell>
                  <TableCell className="max-w-[420px] px-4 align-top">
                    <Link
                      href={`/admin/sermons/${s.id}/edit`}
                      className="block font-medium text-charcoal hover:text-primary-navy hover:underline"
                    >
                      {s.title}
                    </Link>
                    <p className="mt-1 text-xs text-warm-gray">
                      {s.scripture} · {s.preacher}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 text-warm-gray">
                    {format(parseISO(s.sermon_date), "yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-warm-gray hover:text-primary-navy"
                        render={
                          <Link href={`/admin/sermons/${s.id}/edit`}>
                            <Pencil className="size-4" aria-hidden />
                            <span className="sr-only">수정</span>
                          </Link>
                        }
                      />
                      <DeleteButton
                        itemLabel={s.title}
                        iconOnly
                        action={deleteSermon.bind(null, s.id)}
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
        action={bulkDeleteSermons}
        itemLabel="설교"
      />
    </>
  );
}

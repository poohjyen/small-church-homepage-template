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
import { formatFileSize } from "@/lib/data/helpers";
import type { Resource } from "@/types/database";
import { bulkDeleteResources, deleteResource } from "./actions";

const FORM_ID = "admin-resources-bulk";

export function ResourcesTable({ data }: { data: Resource[] }) {
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
    else setSelected(new Set(data.map((r) => r.id)));
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
                <TableHead className="px-4">제목 / 설명</TableHead>
                <TableHead className="w-28 px-4">카테고리</TableHead>
                <TableHead className="w-24 px-4 text-right">크기</TableHead>
                <TableHead className="w-24 px-4 text-right">다운로드</TableHead>
                <TableHead className="w-32 px-4 text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="px-3">
                    <input
                      type="checkbox"
                      name="ids"
                      value={r.id}
                      aria-label={`${r.title} 선택`}
                      checked={selected.has(r.id)}
                      onChange={() => toggle(r.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </TableCell>
                  <TableCell className="max-w-[460px] px-4 align-top">
                    <Link
                      href={`/admin/resources/${r.id}/edit`}
                      className="block font-medium text-charcoal hover:text-primary-navy hover:underline"
                    >
                      {r.title}
                    </Link>
                    {r.description ? (
                      <p className="mt-1 line-clamp-1 text-xs text-warm-gray">
                        {r.description}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-[11px] text-warm-gray">
                      {format(parseISO(r.created_at), "yyyy.MM.dd")} 등록
                    </p>
                  </TableCell>
                  <TableCell className="px-4">
                    <span className="rounded-full bg-soft px-2.5 py-0.5 text-xs text-charcoal">
                      {r.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 text-right tabular-nums text-warm-gray">
                    {formatFileSize(r.file_size)}
                  </TableCell>
                  <TableCell className="px-4 text-right tabular-nums text-warm-gray">
                    {r.download_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-warm-gray hover:text-primary-navy"
                        render={
                          <Link href={`/admin/resources/${r.id}/edit`}>
                            <Pencil className="size-4" aria-hidden />
                            <span className="sr-only">수정</span>
                          </Link>
                        }
                      />
                      <DeleteButton
                        itemLabel={r.title}
                        iconOnly
                        action={deleteResource.bind(null, r.id)}
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
        action={bulkDeleteResources}
        itemLabel="자료"
      />
    </>
  );
}

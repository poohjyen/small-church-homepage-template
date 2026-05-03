"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { cn } from "@/lib/utils";
import type { Gallery } from "@/types/database";
import { bulkDeleteGalleries, deleteGallery } from "./actions";

const FORM_ID = "admin-gallery-bulk";

export function GalleryGrid({ data }: { data: Gallery[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function clear() {
    setSelected(new Set());
  }

  return (
    <>
      <form id={FORM_ID}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((g) => {
            const isSel = selected.has(g.id);
            return (
              <li
                key={g.id}
                className={cn(
                  "overflow-hidden rounded-2xl bg-white ring-1 transition",
                  isSel ? "ring-2 ring-primary-navy" : "ring-black/5",
                )}
              >
                <div className="relative aspect-[4/3] w-full bg-soft">
                  {g.cover_image ? (
                    <Image
                      src={g.cover_image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-charcoal ring-1 ring-black/5">
                    {g.category}
                  </span>
                  <label className="absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/95 ring-1 ring-black/10">
                    <input
                      type="checkbox"
                      name="ids"
                      value={g.id}
                      aria-label={`${g.title} 선택`}
                      checked={isSel}
                      onChange={() => toggle(g.id)}
                      className="size-4 cursor-pointer accent-primary-navy"
                    />
                  </label>
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/gallery/${g.id}/edit`}
                      className="block truncate font-medium text-charcoal hover:text-primary-navy hover:underline"
                    >
                      {g.title}
                    </Link>
                    <p className="mt-1 text-xs text-warm-gray">
                      {g.event_date
                        ? format(parseISO(g.event_date), "yyyy.MM.dd")
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-warm-gray hover:text-primary-navy"
                      render={
                        <Link href={`/admin/gallery/${g.id}/edit`}>
                          <Pencil className="size-4" aria-hidden />
                          <span className="sr-only">수정</span>
                        </Link>
                      }
                    />
                    <DeleteButton
                      itemLabel={g.title}
                      iconOnly
                      action={deleteGallery.bind(null, g.id)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </form>
      <BulkActionBar
        selectedCount={selected.size}
        onClear={clear}
        formId={FORM_ID}
        action={bulkDeleteGalleries}
        itemLabel="앨범"
      />
    </>
  );
}

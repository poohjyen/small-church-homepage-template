import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

import { cn } from "@/lib/utils";

type Item = { href: string; title: string };

type Props = {
  prev: Item | null;
  next: Item | null;
  listHref: string;
  listLabel: string;
};

export function PostNav({ prev, next, listHref, listLabel }: Props) {
  return (
    <nav className="mt-12 border-t border-slate-200 pt-4">
      <ul className="grid grid-cols-2 gap-2">
        <li>
          {prev ? (
            <Link
              href={prev.href}
              className="group flex h-10 items-center gap-1.5 rounded-md bg-white px-3 ring-1 ring-black/5 transition hover:bg-soft hover:ring-secondary-sky/40"
            >
              <ChevronLeft
                className="size-4 shrink-0 text-warm-gray transition group-hover:text-secondary-sky"
                aria-hidden
              />
              <span className="hidden shrink-0 text-xs font-semibold text-warm-gray sm:inline">
                이전
              </span>
              <span className="truncate text-sm text-charcoal transition group-hover:text-primary-navy">
                {prev.title}
              </span>
            </Link>
          ) : (
            <DisabledItem direction="prev" />
          )}
        </li>
        <li>
          {next ? (
            <Link
              href={next.href}
              className="group flex h-10 items-center justify-end gap-1.5 rounded-md bg-white px-3 ring-1 ring-black/5 transition hover:bg-soft hover:ring-secondary-sky/40"
            >
              <span className="truncate text-sm text-charcoal transition group-hover:text-primary-navy">
                {next.title}
              </span>
              <span className="hidden shrink-0 text-xs font-semibold text-warm-gray sm:inline">
                다음
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-warm-gray transition group-hover:text-secondary-sky"
                aria-hidden
              />
            </Link>
          ) : (
            <DisabledItem direction="next" />
          )}
        </li>
      </ul>

      <div className="mt-3 text-center">
        <Link
          href={listHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-navy px-4 py-1.5 text-xs font-medium text-white transition hover:bg-secondary-sky"
        >
          <List className="size-3.5" aria-hidden /> {listLabel}
        </Link>
      </div>
    </nav>
  );
}

function DisabledItem({ direction }: { direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-md bg-soft px-3 ring-1 ring-black/5 opacity-60",
        !isPrev && "justify-end",
      )}
      aria-disabled="true"
    >
      {isPrev ? (
        <ChevronLeft className="size-4 shrink-0 text-warm-gray/60" aria-hidden />
      ) : null}
      <span className="text-xs text-warm-gray">
        {isPrev ? "이전 글 없음" : "다음 글 없음"}
      </span>
      {!isPrev ? (
        <ChevronRight className="size-4 shrink-0 text-warm-gray/60" aria-hidden />
      ) : null}
    </div>
  );
}

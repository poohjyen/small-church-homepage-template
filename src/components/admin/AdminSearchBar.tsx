"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  paramName?: string;
  className?: string;
};

export function AdminSearchBar({
  placeholder = "검색어 입력",
  paramName = "q",
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initial = params?.get(paramName) ?? "";
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();

  function commit(next: string) {
    const sp = new URLSearchParams(params?.toString() ?? "");
    if (next.trim()) sp.set(paramName, next.trim());
    else sp.delete(paramName);
    sp.delete("page");
    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    commit(value);
  }

  function clear() {
    setValue("");
    commit("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex h-10 items-center gap-2 rounded-lg bg-white px-3 ring-1 ring-black/10 focus-within:ring-primary-navy/40 sm:max-w-sm",
        className,
      )}
      role="search"
    >
      <Search
        className={cn(
          "size-4 shrink-0 text-warm-gray",
          pending && "animate-pulse",
        )}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-warm-gray/70"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          className="inline-flex size-6 items-center justify-center rounded-full text-warm-gray transition hover:bg-soft hover:text-charcoal"
          aria-label="검색어 지우기"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}

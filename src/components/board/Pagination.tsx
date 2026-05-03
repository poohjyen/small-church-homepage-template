import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  basePath: string;
  page: number;
  perPage: number;
  total: number;
  searchParams?: Record<string, string | undefined>;
};

function buildHref(basePath: string, page: number, extra?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  for (const [k, v] of Object.entries(extra ?? {})) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ basePath, page, perPage, total, searchParams }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="페이지 이동"
    >
      <PageLink
        href={buildHref(basePath, Math.max(1, page - 1), searchParams)}
        disabled={prevDisabled}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </PageLink>

      {pages.map((p) => (
        <PageLink
          key={p}
          href={buildHref(basePath, p, searchParams)}
          active={p === page}
        >
          {p}
        </PageLink>
      ))}

      <PageLink
        href={buildHref(basePath, Math.min(totalPages, page + 1), searchParams)}
        disabled={nextDisabled}
        aria-label="다음 페이지"
      >
        <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-medium transition";
  if (disabled) {
    return (
      <span
        className={`${base} cursor-not-allowed text-warm-gray/50`}
        aria-disabled
        {...rest}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${
        active
          ? "bg-primary-navy text-white"
          : "text-charcoal hover:bg-slate-100"
      }`}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}

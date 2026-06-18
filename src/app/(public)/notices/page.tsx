import Link from "next/link";
import { Pin } from "lucide-react";
import { format } from "date-fns";
import { getNotices } from "@/lib/data/notices";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";

export const metadata = { title: "교회소식" };

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NoticesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { data, total } = await getNotices({
    page,
    perPage: PER_PAGE,
    category: "news",
    publishedOnly: true,
  });

  return (
    <>
      <PageHero eyebrow="CHURCH NEWS" title="교회소식" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      {data.length === 0 ? (
        <EmptyState message="등록된 교회소식이 없습니다." />
      ) : (
        <>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <ul className="divide-y divide-slate-200">
              {data.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/notices/${n.id}`}
                    className="flex items-center gap-4 px-5 py-5 transition hover:bg-slate-50 md:px-6 md:py-6"
                  >
                    {n.is_pinned ? (
                      <span
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-coral/15 text-accent-coral"
                        aria-label="고정글"
                        title="고정글"
                      >
                        <Pin className="size-4" aria-hidden />
                      </span>
                    ) : (
                      <span className="hidden size-7 shrink-0 md:inline-block" aria-hidden />
                    )}
                    <span className="flex-1 truncate text-base font-medium text-charcoal md:text-lg">
                      {n.title}
                    </span>
                    <time
                      className="shrink-0 text-sm text-warm-gray md:text-base"
                      dateTime={n.created_at}
                    >
                      {format(new Date(n.created_at), "yyyy.MM.dd")}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            basePath="/notices"
            page={page}
            perPage={PER_PAGE}
            total={total}
          />
        </>
      )}
      </div>
    </>
  );
}

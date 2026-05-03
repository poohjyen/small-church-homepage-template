import Link from "next/link";
import { format } from "date-fns";
import { getColumns } from "@/lib/data/columns";
import { previewBody } from "@/lib/data/helpers";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";

export const metadata = { title: "목양칼럼" };

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ColumnsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { data, total } = await getColumns({ page, perPage: PER_PAGE });

  return (
    <>
      <PageHero eyebrow="COLUMNS" title="목양칼럼" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      {data.length === 0 ? (
        <EmptyState message="등록된 칼럼이 없습니다." />
      ) : (
        <>
          <ul className="mx-auto max-w-4xl space-y-5">
            {data.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/columns/${c.id}`}
                  className="group block rounded-2xl bg-white p-6 ring-1 ring-black/5 transition hover:shadow-md md:p-8"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-bold text-charcoal group-hover:text-primary-navy md:text-xl">
                      {c.title}
                    </h2>
                    <time
                      className="shrink-0 text-sm text-warm-gray"
                      dateTime={c.published_date}
                    >
                      {format(new Date(c.published_date), "yyyy.MM.dd")}
                    </time>
                  </div>
                  <p className="mt-3 line-clamp-2 text-base leading-relaxed text-warm-gray">
                    {previewBody(c.content, 130)}
                  </p>
                  <p className="mt-4 text-sm text-secondary-sky">
                    {c.author}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination
            basePath="/columns"
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

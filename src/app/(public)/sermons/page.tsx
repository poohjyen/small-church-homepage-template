import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { getSermons } from "@/lib/data/sermons";
import { youtubeThumb } from "@/lib/data/helpers";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";

export const metadata = { title: "주일설교" };

const PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function SermonsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { data, total } = await getSermons({
    page,
    perPage: PER_PAGE,
    publishedOnly: true,
  });

  return (
    <>
      <PageHero eyebrow="SERMONS" title="주일설교" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      {data.length === 0 ? (
        <EmptyState message="등록된 설교가 없습니다." />
      ) : (
        <>
          <ul className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/sermons/${s.id}`}
                  className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <Image
                      src={youtubeThumb(s.youtube_id)}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                      <PlayCircle className="size-14 text-white" aria-hidden />
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="line-clamp-2 text-lg font-bold text-charcoal group-hover:text-primary-navy">
                      {s.title}
                    </h2>
                    {s.scripture ? (
                      <p className="mt-2 text-sm text-secondary-sky">
                        {s.scripture}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between text-sm text-warm-gray">
                      <span>{s.preacher}</span>
                      <time dateTime={s.sermon_date}>
                        {format(new Date(s.sermon_date), "yyyy.MM.dd")}
                      </time>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination
            basePath="/sermons"
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

import Link from "next/link";
import { FileText, Download, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { getBulletins } from "@/lib/data/bulletins";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";
import { BulletinPreview } from "@/components/bulletins/BulletinPreview";

export const metadata = { title: "주보" };

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BulletinsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { data, total } = await getBulletins({
    page,
    perPage: PER_PAGE,
    publishedOnly: true,
  });

  return (
    <>
      <PageHero eyebrow="BULLETINS" title="주보" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      {data.length === 0 ? (
        <EmptyState
          message="등록된 주보가 없습니다."
          icon={<FileText className="size-12" strokeWidth={1.5} />}
        />
      ) : (
        <>
          {/* 모바일: 행 레이아웃 (썸네일 + 제목/날짜 + 다운로드) */}
          <ul className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 sm:hidden">
            {data.map((b) => (
              <li key={b.id}>
                <div className="flex items-center gap-3 px-4 py-3">
                  {b.thumbnail_url ? (
                    <Link
                      href={`/bulletins/${b.id}`}
                      className="size-14 shrink-0"
                      aria-label={`${b.title} 보기`}
                    >
                      <BulletinPreview
                        src={b.thumbnail_url}
                        alt={b.title}
                        className="group relative block size-14 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/5 transition hover:shadow-md"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={`/bulletins/${b.id}`}
                      className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-navy/10 text-primary-navy transition hover:bg-primary-navy/15"
                      aria-label={`${b.title} 보기`}
                    >
                      <FileText className="size-6" strokeWidth={1.5} aria-hidden />
                    </Link>
                  )}
                  <Link
                    href={`/bulletins/${b.id}`}
                    className="flex min-w-0 flex-1 flex-col py-1 transition hover:text-primary-navy"
                  >
                    <p className="text-sm font-bold text-charcoal">
                      {format(new Date(b.bulletin_date), "yyyy.MM.dd")}
                    </p>
                    <p className="line-clamp-1 text-xs text-warm-gray">
                      {b.title}
                    </p>
                  </Link>
                  <a
                    href={b.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    aria-label={`${b.title} 다운로드`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-navy text-white transition active:bg-secondary-sky"
                  >
                    <Download className="size-4" aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* 데스크톱: 카드 그리드 */}
          <ul className="mx-auto hidden max-w-6xl gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {data.map((b) => (
              <li
                key={b.id}
                className="flex flex-col items-center rounded-2xl bg-soft p-8 text-center ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {b.thumbnail_url ? (
                  <Link
                    href={`/bulletins/${b.id}`}
                    className="w-full max-w-[220px]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.thumbnail_url}
                        alt={b.title}
                        className="absolute inset-0 size-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  </Link>
                ) : (
                  <Link href={`/bulletins/${b.id}`}>
                    <FileText
                      className="size-12 text-primary-navy"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                )}
                <Link href={`/bulletins/${b.id}`} className="mt-4 group">
                  <p className="text-2xl font-bold text-charcoal transition group-hover:text-primary-navy">
                    {format(new Date(b.bulletin_date), "yyyy.MM.dd")}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-warm-gray">
                    {b.title}
                  </p>
                </Link>
                <div className="mt-6 flex items-center gap-2">
                  <Link
                    href={`/bulletins/${b.id}`}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-sky"
                  >
                    내용 보기 <ChevronRight className="size-4" aria-hidden />
                  </Link>
                  <a
                    href={b.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1 rounded-md border border-primary-navy/30 bg-white px-4 py-2.5 text-sm font-medium text-primary-navy transition hover:bg-primary-navy/5"
                  >
                    <Download className="size-4" aria-hidden /> PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            basePath="/bulletins"
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

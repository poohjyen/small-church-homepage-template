import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { getResources } from "@/lib/data/resources";
import {
  RESOURCE_CATEGORIES,
  type ResourceCategory,
  formatFileSize,
} from "@/lib/data/helpers";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";

export const metadata = { title: "자료실" };

const PER_PAGE = 15;

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

function isCategory(value: string | undefined): value is ResourceCategory {
  return !!value && (RESOURCE_CATEGORIES as readonly string[]).includes(value);
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const category: ResourceCategory = isCategory(categoryParam)
    ? categoryParam
    : "전체";
  const { data, total } = await getResources({
    category,
    page,
    perPage: PER_PAGE,
  });

  return (
    <>
      <PageHero eyebrow="RESOURCES" title="자료실" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      <nav
        className="mx-auto mb-10 flex max-w-4xl flex-wrap justify-center gap-2"
        aria-label="카테고리 필터"
      >
        {RESOURCE_CATEGORIES.map((cat) => {
          const isActive = cat === category;
          const href =
            cat === "전체"
              ? "/resources"
              : `/resources?category=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`rounded-full px-5 py-2.5 text-base font-medium transition ${
                isActive
                  ? "bg-primary-navy text-white"
                  : "bg-slate-100 text-charcoal hover:bg-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {data.length === 0 ? (
        <EmptyState
          message="해당 카테고리의 자료가 없습니다."
          icon={<FileText className="size-12" strokeWidth={1.5} />}
        />
      ) : (
        <>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <ul className="divide-y divide-slate-200">
              {data.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:gap-4 md:px-6 md:py-5"
                >
                  <div className="flex flex-1 items-start gap-4 min-w-0">
                    <FileText
                      className="mt-0.5 size-6 shrink-0 text-primary-navy"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="inline-block text-sm font-semibold uppercase tracking-wider text-secondary-sky">
                        {r.category}
                      </p>
                      <h2 className="mt-1 truncate text-base font-medium text-charcoal md:text-lg">
                        {r.title}
                      </h2>
                      {r.description ? (
                        <p className="mt-1 line-clamp-1 text-[15px] text-warm-gray">
                          {r.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-warm-gray md:gap-5">
                    <span className="hidden md:inline">
                      {formatFileSize(r.file_size)}
                    </span>
                    <time
                      className="hidden md:inline"
                      dateTime={r.created_at}
                    >
                      {format(new Date(r.created_at), "yyyy.MM.dd")}
                    </time>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary-sky"
                    >
                      <Download className="size-4" aria-hidden /> 다운로드
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            basePath="/resources"
            page={page}
            perPage={PER_PAGE}
            total={total}
            searchParams={{
              category: category !== "전체" ? category : undefined,
            }}
          />
        </>
      )}
      </div>
    </>
  );
}

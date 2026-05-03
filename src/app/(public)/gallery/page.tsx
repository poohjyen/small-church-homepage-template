import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { getGalleries } from "@/lib/data/galleries";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/data/helpers";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";

export const metadata = { title: "갤러리" };

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

function isCategory(value: string | undefined): value is GalleryCategory {
  return !!value && (GALLERY_CATEGORIES as readonly string[]).includes(value);
}

export default async function GalleryPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const category: GalleryCategory = isCategory(categoryParam)
    ? categoryParam
    : "전체";
  const { data, total } = await getGalleries({
    category,
    page,
    perPage: PER_PAGE,
  });

  return (
    <>
      <PageHero eyebrow="GALLERY" title="갤러리" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      <nav
        className="mx-auto mb-10 flex max-w-4xl flex-wrap justify-center gap-2"
        aria-label="카테고리 필터"
      >
        {GALLERY_CATEGORIES.map((cat) => {
          const isActive = cat === category;
          const href =
            cat === "전체" ? "/gallery" : `/gallery?category=${encodeURIComponent(cat)}`;
          return (
            <Link
              key={cat}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
        <EmptyState message="해당 카테고리의 앨범이 없습니다." />
      ) : (
        <>
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {data.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/gallery/${g.id}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {g.cover_image ? (
                      <Image
                        src={g.cover_image}
                        alt={g.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-3 sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-sky sm:text-xs">
                      {g.category}
                    </p>
                    <h2 className="mt-1.5 line-clamp-2 text-sm font-bold text-charcoal group-hover:text-primary-navy sm:mt-2 sm:text-lg">
                      {g.title}
                    </h2>
                    {g.event_date ? (
                      <time
                        className="mt-1 block text-xs text-warm-gray sm:mt-2 sm:text-sm"
                        dateTime={g.event_date}
                      >
                        {format(new Date(g.event_date), "yyyy.MM.dd")}
                      </time>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination
            basePath="/gallery"
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

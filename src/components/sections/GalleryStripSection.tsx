import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import type { Gallery } from "@/types/database";

import { SectionContainer } from "./SectionContainer";

type Props = {
  galleries: Gallery[];
};

export function GalleryStripSection({ galleries }: Props) {
  const desktopItems = galleries.slice(0, 3);
  const mobileItems = galleries.slice(0, 4);

  return (
    <SectionContainer bg="white">
      <SectionHeading eyebrow="GALLERY" title="갤러리" />

      {/* 데스크톱: 가로 3장 */}
      <ul className="mt-6 hidden gap-5 md:grid md:grid-cols-3 md:gap-4">
        {desktopItems.map((g) => (
          <li key={g.id}>
            <Link
              href={`/gallery/${g.id}`}
              className="group block overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-secondary-sky/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {g.cover_image ? (
                  <Image
                    src={g.cover_image}
                    alt={g.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex items-baseline justify-between gap-3 bg-white px-5 py-3">
                <p className="line-clamp-1 text-sm font-bold text-primary-navy transition group-hover:text-secondary-sky">
                  {g.title}
                </p>
                <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary-sky">
                  {g.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* 모바일: 2x2 정사각형 */}
      <ul className="mt-6 grid grid-cols-2 gap-3 md:hidden">
        {mobileItems.map((g) => (
          <li key={g.id}>
            <Link
              href={`/gallery/${g.id}`}
              className="group block overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5 transition active:ring-secondary-sky/40"
            >
              <div className="relative aspect-square overflow-hidden">
                {g.cover_image ? (
                  <Image
                    src={g.cover_image}
                    alt={g.title}
                    fill
                    sizes="50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <p className="truncate bg-white px-3 py-2 text-xs font-semibold text-primary-navy">
                {g.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

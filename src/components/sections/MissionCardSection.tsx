import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import type { MissionsCardValue } from "@/types/database";

type Props = {
  card: MissionsCardValue;
};

export function MissionCardSection({ card }: Props) {
  return (
    <section
      aria-label="선교 이야기"
      className="bg-[var(--color-tone-beige)] py-6 md:py-10"
    >
      <div className="container mx-auto grid items-center gap-8 px-4 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden shadow-md ring-1 ring-black/5">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-secondary-sky/10 text-secondary-sky"
            >
              선교 사진
            </div>
          )}
        </div>
        <div>
          <SectionHeading align="left" eyebrow="MISSION" title={card.title} />
          <p className="mt-5 line-clamp-3 whitespace-pre-line text-base leading-relaxed text-warm-gray md:line-clamp-none md:text-lg">
            {card.body}
          </p>
          {card.cta_label && card.cta_href ? (
            <Link
              href={card.cta_href}
              className="mt-8 inline-flex items-center justify-center bg-primary-navy px-7 py-3 text-base font-bold text-white transition hover:bg-secondary-sky focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary-sky/40"
            >
              {card.cta_label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

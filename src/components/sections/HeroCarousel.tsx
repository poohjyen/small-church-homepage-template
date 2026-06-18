"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import type { HeroSlide } from "@/types/database";

type Props = {
  slides: HeroSlide[];
  ctaHref: string;
  ctaLabel: string;
};

export function HeroCarousel({ slides, ctaHref, ctaLabel }: Props) {
  // 디졸브 전환(Fade), 자동전환 X (좌우 버튼 클릭으로만), duration 길게
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1, duration: 80 },
    [Fade()],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("init", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const hasMulti = slides.length > 1;

  const current = slides[selectedIndex] ?? slides[0];
  const eyebrow = current?.title ?? SITE.name;
  const headline = current?.subtitle ?? "함께 세워가는 신앙 공동체";

  return (
    <section
      aria-label={`${SITE.name} 메인 슬라이드`}
      className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:h-[52svh] md:min-h-[420px] lg:h-[62svh] lg:min-h-[520px]"
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative h-full w-full shrink-0 grow-0 basis-full"
            >
              <Image
                src={slide.image_url}
                alt={slide.title ?? SITE.name}
                fill
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover animate-ken-burns"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center px-6 pb-0">
        <div className="container mx-auto">
          <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/80 md:text-[11px] [text-shadow:_0_1px_6px_rgba(0,0,0,0.45)]">
              {eyebrow}
            </span>
            <p className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl xl:text-[56px] [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
              {headline}
            </p>
            <Link
              href={ctaHref}
              aria-label={ctaLabel}
              className="mt-5 inline-flex items-center justify-center border border-white/70 bg-white/10 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.32em] text-white backdrop-blur-sm transition hover:bg-white hover:text-primary-navy md:mt-8"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {hasMulti ? (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="이전 슬라이드"
            className="absolute left-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25 hover:border-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 md:left-8 md:size-12"
          >
            <ChevronLeft className="size-5 md:size-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음 슬라이드"
            className="absolute right-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25 hover:border-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 md:right-8 md:size-12"
          >
            <ChevronRight className="size-5 md:size-6" aria-hidden />
          </button>

          <div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:bottom-[4.5rem]"
            role="tablist"
            aria-label="슬라이드 선택"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={selectedIndex === i}
                aria-label={`슬라이드 ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  selectedIndex === i
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

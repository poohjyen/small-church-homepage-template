"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { MoreLink } from "@/components/ui/more-link";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types/database";
import { CHURCH } from "../../../church.config";

type Props = {
  slides: HeroSlide[];
  ctaHref: string;
  ctaLabel: string;
};

export function HeroCarousel({ slides, ctaHref, ctaLabel }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
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

  const current = slides[selectedIndex] ?? slides[0];

  return (
    <section
      aria-label={`${CHURCH.name} 메인 슬라이드`}
      className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-[55svh] md:min-h-[420px]"
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
                alt={slide.title ?? CHURCH.name}
                fill
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover animate-ken-burns"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 hidden items-center px-6 pb-0 md:flex">
        <div className="container mx-auto">
          <div className="pointer-events-auto mx-auto max-w-2xl space-y-3 text-center">
            {current?.title ? (
              <p className="text-2xl font-bold leading-snug text-white/90 md:text-3xl lg:text-4xl [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
                {current.title}
              </p>
            ) : null}
            {current?.subtitle ? (
              <p className="text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl [text-shadow:_0_2px_12px_rgba(0,0,0,0.55)]">
                {current.subtitle}
              </p>
            ) : null}
            <div className="flex justify-center pt-3">
              <MoreLink href={ctaHref} tone="white" size="md">
                {ctaLabel}
              </MoreLink>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2"
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
                "h-2.5 rounded-full transition-all",
                selectedIndex === i
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

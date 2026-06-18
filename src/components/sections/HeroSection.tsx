import type { HeroSlide } from "@/types/database";

import { HeroCarousel } from "./HeroCarousel";

type Props = { slides: HeroSlide[] };

export function HeroSection({ slides }: Props) {
  return (
    <HeroCarousel slides={slides} ctaHref="/about" ctaLabel="환영인사" />
  );
}

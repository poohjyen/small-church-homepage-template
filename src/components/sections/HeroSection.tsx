import type { HeroSlide } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { HeroCarousel } from "./HeroCarousel";

type Props = { slides: HeroSlide[] };

const PLACEHOLDER_SLIDES: HeroSlide[] = [
  {
    id: "placeholder-1",
    image_url: "/images/hero/hero-1-placeholder.svg",
    title: "환영합니다",
    subtitle: null,
    display_order: 0,
    is_active: true,
    created_at: "",
  },
];

export function HeroSection({ slides }: Props) {
  const slidesToRender = slides.length > 0 ? slides : PLACEHOLDER_SLIDES.map((s) => ({
    ...s,
    subtitle: CHURCH.name,
  }));
  return (
    <HeroCarousel slides={slidesToRender} ctaHref="/about" ctaLabel="환영인사" />
  );
}

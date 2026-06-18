import { ParallaxHero } from "@/components/layout/ParallaxHero";
import type { ParallaxBandValue } from "@/types/database";

export function ParallaxBand({
  band,
  fallbackImage,
}: {
  band: ParallaxBandValue | null | undefined;
  fallbackImage: string;
}) {
  const ctaLabel = band?.cta_label?.trim();
  return (
    <ParallaxHero
      image={band?.image?.trim() || fallbackImage}
      title={band?.headline?.trim() || undefined}
      subtitle={band?.subtitle?.trim() || undefined}
      cta={
        ctaLabel
          ? { label: ctaLabel, href: band?.cta_href?.trim() || "#" }
          : undefined
      }
    />
  );
}

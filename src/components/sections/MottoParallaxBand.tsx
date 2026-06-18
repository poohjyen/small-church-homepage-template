import { ParallaxHero } from "@/components/layout/ParallaxHero";
import type { ParallaxBandValue, SettingValueMap } from "@/types/database";

const DEFAULT_IMAGE = "/images/gallery/g1.jpg";
const DEFAULT_MOTTO = "하나되어 내일을 준비하는 교회";

export function MottoParallaxBand({
  motto,
  band,
}: {
  motto: SettingValueMap["year_motto"] | null;
  band: ParallaxBandValue | null | undefined;
}) {
  const image = band?.image?.trim() || DEFAULT_IMAGE;
  const headline = band?.headline?.trim() || motto?.motto?.trim() || DEFAULT_MOTTO;
  const subtitle = band?.subtitle?.trim() || motto?.scripture?.trim() || undefined;
  const ctaLabel = band?.cta_label?.trim() || "교회 비전 둘러보기";
  const ctaHref = band?.cta_href?.trim() || "/about/vision";

  return (
    <ParallaxHero
      image={image}
      eyebrow={motto?.year ? `${motto.year} 표어` : undefined}
      title={headline}
      subtitle={subtitle}
      cta={{ label: ctaLabel, href: ctaHref }}
    />
  );
}

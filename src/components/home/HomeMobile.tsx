import type { ReactNode } from "react";

import { FeaturedSermonSection } from "@/components/sections/FeaturedSermonSection";
import { GalleryStripSection } from "@/components/sections/GalleryStripSection";
import { GreetingHubMobile } from "@/components/sections/GreetingHubMobile";
import { HeroSection } from "@/components/sections/HeroSection";
import { LocationMobile } from "@/components/sections/LocationMobile";
import { MissionCardSection } from "@/components/sections/MissionCardSection";
import { OnlineGivingSection } from "@/components/sections/OnlineGivingSection";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";
import { SermonsQuadSection } from "@/components/sections/SermonsQuadSection";
import { VisionCardSection } from "@/components/sections/VisionCardSection";
import { WorshipSection } from "@/components/sections/WorshipSection";
import { FadeIn, type Direction } from "@/components/ui/fade-in";
import type { LandingData } from "@/lib/data/landing";
import type { LandingSectionKey } from "@/lib/landing-sections";

type Props = { data: LandingData };

// 모바일은 좌우 이동 없이 — 풀폭 밴드 zoom, 내부 stagger 보유 섹션은 none, 나머지 up
const MOBILE_SECTION_DIRECTION: Record<LandingSectionKey, Direction> = {
  greeting: "none",
  vision: "zoom",
  worship: "none",
  "featured-sermon": "none",
  "sermons-quad": "none",
  "gallery-strip": "none",
  "quick-actions": "zoom",
  "mission-card": "up",
  "online-giving": "zoom",
  location: "up",
};

const MOBILE_SECTION_ORDER: LandingSectionKey[] = [
  "greeting",
  "vision",
  "worship",
  "featured-sermon",
  "gallery-strip",
  "sermons-quad",
  "quick-actions",
  "online-giving",
  "location",
];

export function HomeMobile({ data }: Props) {
  const renderers: Record<LandingSectionKey, () => ReactNode> = {
    greeting: () => <GreetingHubMobile />,
    vision: () => <VisionCardSection motto={data.yearMotto} />,
    worship: () => (
      <WorshipSection items={data.worshipItems} reveal className="pt-6" />
    ),
    "featured-sermon": () => (
      <FeaturedSermonSection sermon={data.featuredSermon} />
    ),
    "sermons-quad": () => (
      <SermonsQuadSection
        sermons={data.recentSermons}
        columns={data.recentColumns}
        notices={data.notices}
        bulletins={data.bulletins}
      />
    ),
    "gallery-strip": () => <GalleryStripSection galleries={data.galleries} />,
    "quick-actions": () => (
      <QuickActionsSection
        bgImage={data.parallaxBands?.home_invite?.image?.trim() || undefined}
      />
    ),
    "mission-card": () => <MissionCardSection card={data.missionsCard} />,
    "online-giving": () => (
      <OnlineGivingSection
        accounts={data.offeringAccounts}
        bgImage={data.parallaxBands?.home_giving?.image?.trim() || undefined}
      />
    ),
    location: () => <LocationMobile contact={data.contact} />,
  };

  const visibleByKey = new Map(data.sections.map((s) => [s.key, s.visible]));

  return (
    <>
      <HeroSection slides={data.heroSlides} />
      {MOBILE_SECTION_ORDER.map((key) => {
        if (visibleByKey.get(key) === false) return null;
        return (
          <FadeIn key={key} direction={MOBILE_SECTION_DIRECTION[key]}>
            {renderers[key]()}
          </FadeIn>
        );
      })}
    </>
  );
}

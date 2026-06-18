import { Fragment, type ReactNode } from "react";

import { FeaturedSermonSection } from "@/components/sections/FeaturedSermonSection";
import { GalleryStripSection } from "@/components/sections/GalleryStripSection";
import { GreetingHubSection } from "@/components/sections/GreetingHubSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { MissionCardSection } from "@/components/sections/MissionCardSection";
import { OnlineGivingSection } from "@/components/sections/OnlineGivingSection";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";
import { SermonsQuadSection } from "@/components/sections/SermonsQuadSection";
import { VisionCardSection } from "@/components/sections/VisionCardSection";
import { WorshipSection } from "@/components/sections/WorshipSection";
import { FadeIn, type Direction } from "@/components/ui/fade-in";
import { SectionEditAnchor } from "@/components/edit-mode/SectionEditAnchor";
import {
  HERO_EDIT_TARGET,
  LANDING_EDIT_TARGETS,
} from "@/components/edit-mode/section-targets";
import type { LandingData } from "@/lib/data/landing";
import type { LandingSectionKey } from "@/lib/landing-sections";

type Props = { data: LandingData; isAdmin?: boolean };

// 풀폭 사진 띠는 bg-fixed 패럴럭스가 동작하려면 transform(FadeIn) 조상이 없어야 한다.
// (about 페이지의 ParallaxBand 처럼 FadeIn 으로 감싸지 않고 그대로 렌더)
const PARALLAX_BANDS = new Set<LandingSectionKey>([
  "vision",
  "quick-actions",
  "online-giving",
]);

// 섹션 등장 다양화 — 풀폭 밴드는 zoom, 내부에 stagger/교차가 있는 섹션은
// 외부 래퍼를 순수 fade(none)로 두어 이중 transform을 피한다.
const SECTION_DIRECTION: Record<LandingSectionKey, Direction> = {
  greeting: "none",
  vision: "zoom",
  worship: "none",
  "featured-sermon": "none",
  "sermons-quad": "none",
  "gallery-strip": "none",
  "quick-actions": "zoom",
  "mission-card": "up",
  "online-giving": "zoom",
  location: "none",
};

export function HomeDesktop({ data, isAdmin = false }: Props) {
  const renderers: Record<LandingSectionKey, () => ReactNode> = {
    greeting: () => <GreetingHubSection />,
    vision: () => <VisionCardSection motto={data.yearMotto} />,
    worship: () => (
      <WorshipSection items={data.worshipItems} reveal className="pt-8 md:pt-12" />
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
    location: () => <LocationSection contact={data.contact} />,
  };

  return (
    <>
      {isAdmin ? (
        <SectionEditAnchor target={HERO_EDIT_TARGET}>
          <HeroSection slides={data.heroSlides} />
        </SectionEditAnchor>
      ) : (
        <HeroSection slides={data.heroSlides} />
      )}
      {data.sections
        .filter((s) => s.visible && s.key !== "mission-card")
        .map((s) => {
          const content = renderers[s.key]();
          const node = PARALLAX_BANDS.has(s.key) ? (
            <Fragment key={s.key}>{content}</Fragment>
          ) : (
            <FadeIn key={s.key} direction={SECTION_DIRECTION[s.key]}>
              {content}
            </FadeIn>
          );
          const target = LANDING_EDIT_TARGETS[s.key];
          return isAdmin && target ? (
            <SectionEditAnchor key={s.key} target={target}>
              {node}
            </SectionEditAnchor>
          ) : (
            node
          );
        })}
    </>
  );
}

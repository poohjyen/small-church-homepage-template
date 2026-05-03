import type { ReactNode } from "react";

import { FeaturedSermonSection } from "@/components/sections/FeaturedSermonSection";
import { GalleryStripSection } from "@/components/sections/GalleryStripSection";
import { GreetingHubSection } from "@/components/sections/GreetingHubSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { OnlineGivingSection } from "@/components/sections/OnlineGivingSection";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";
import { SermonsQuadSection } from "@/components/sections/SermonsQuadSection";
import { VisionCardSection } from "@/components/sections/VisionCardSection";
import { FadeIn } from "@/components/ui/fade-in";
import type { LandingData } from "@/lib/data/landing";
import type { LandingSectionKey } from "@/lib/landing-sections";

type Props = { data: LandingData };

export function HomeDesktop({ data }: Props) {
  const renderers: Record<LandingSectionKey, () => ReactNode> = {
    greeting: () => <GreetingHubSection />,
    vision: () => <VisionCardSection />,
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
    "quick-actions": () => <QuickActionsSection />,
    "online-giving": () => (
      <OnlineGivingSection accounts={data.offeringAccounts} />
    ),
    location: () => <LocationSection contact={data.contact} />,
  };

  return (
    <>
      <HeroSection slides={data.heroSlides} />
      {data.sections
        .filter((s) => s.visible)
        .map((s) => (
          <FadeIn key={s.key} direction="up">
            {renderers[s.key]()}
          </FadeIn>
        ))}
    </>
  );
}

import { getAllSiteSettings } from "@/lib/data/site";
import { SITE } from "@/lib/site";
import type { SettingValueMap } from "@/types/database";

import { HeaderClient } from "./HeaderClient";

type Sns = SettingValueMap["sns"];

// 설정(site_settings.sns)이 비어 있을 때의 폴백 — church.config의 SNS 링크.
const FALLBACK_SNS: Sns = {
  band: SITE.social.band,
  youtube: SITE.social.youtube,
  instagram: SITE.social.instagram,
};

export async function Header() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const sns = (settings.sns as Sns | undefined) ?? FALLBACK_SNS;
  return <HeaderClient sns={sns} />;
}

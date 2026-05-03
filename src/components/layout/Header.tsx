import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";

import { HeaderClient } from "./HeaderClient";

type Sns = SettingValueMap["sns"];

const EMPTY_SNS: Sns = { band: "", youtube: "", instagram: "" };

export async function Header() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const sns = (settings.sns as Sns | undefined) ?? EMPTY_SNS;
  return <HeaderClient sns={sns} />;
}

import { getBulletins } from "@/lib/data/bulletins";
import { getColumns } from "@/lib/data/columns";
import { getRecentGalleries } from "@/lib/data/galleries";
import { getRecentNotices } from "@/lib/data/notices";
import { getResources } from "@/lib/data/resources";
import { getRecentSermons } from "@/lib/data/sermons";
import { getActiveHeroSlides, getSiteSetting } from "@/lib/data/site";
import {
  normalizeLandingSections,
  type LandingSectionConfig,
} from "@/lib/landing-sections";
import { CHURCH } from "../../../church.config";
import type {
  Bulletin,
  Gallery,
  HeroSlide,
  Notice,
  PastoralColumn,
  Resource,
  Sermon,
  SettingValueMap,
} from "@/types/database";

export type LandingData = {
  heroSlides: HeroSlide[];
  featuredSermon: Sermon | null;
  bulletins: Bulletin[];
  notices: Notice[];
  galleries: Gallery[];
  recentSermons: Sermon[];
  recentColumns: PastoralColumn[];
  recentResources: Resource[];
  contact: SettingValueMap["contact"];
  offeringAccounts: SettingValueMap["offering_accounts"]["items"];
  adminName: string;
  sections: LandingSectionConfig[];
};

const EMPTY_CONTACT: SettingValueMap["contact"] = {
  address: "",
  phone: "",
  account: "",
};

function withFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch(() => fallback);
}

export async function getLandingData(): Promise<LandingData> {
  const [
    slides,
    featuredArr,
    bulletinsRes,
    noticesArr,
    galleriesArr,
    sermonsArr,
    columnsRes,
    resourcesRes,
    contactSetting,
    offeringAccountsSetting,
    adminNameSetting,
    landingSectionsSetting,
  ] = await Promise.all([
    withFallback(getActiveHeroSlides(), [] as HeroSlide[]),
    withFallback(getRecentSermons(1), [] as Sermon[]),
    withFallback(getBulletins({ perPage: 3 }), {
      data: [] as Bulletin[],
      total: 0,
    }),
    withFallback(getRecentNotices(4), [] as Notice[]),
    withFallback(getRecentGalleries(3), [] as Gallery[]),
    withFallback(getRecentSermons(3), [] as Sermon[]),
    withFallback(getColumns({ perPage: 3 }), {
      data: [] as PastoralColumn[],
      total: 0,
    }),
    withFallback(getResources({ perPage: 3 }), {
      data: [] as Resource[],
      total: 0,
    }),
    withFallback(
      getSiteSetting("contact"),
      null as SettingValueMap["contact"] | null,
    ),
    withFallback(
      getSiteSetting("offering_accounts"),
      null as SettingValueMap["offering_accounts"] | null,
    ),
    withFallback(getSiteSetting("admin_name"), null as string | null),
    withFallback(
      getSiteSetting("landing_sections"),
      null as SettingValueMap["landing_sections"] | null,
    ),
  ]);

  return {
    heroSlides: slides,
    featuredSermon: featuredArr[0] ?? null,
    bulletins: bulletinsRes.data,
    notices: noticesArr,
    galleries: galleriesArr,
    recentSermons: sermonsArr,
    recentColumns: columnsRes.data,
    recentResources: resourcesRes.data,
    contact: contactSetting
      ? {
          address: contactSetting.address || "",
          phone: contactSetting.phone || "",
          account: contactSetting.account || "",
        }
      : EMPTY_CONTACT,
    offeringAccounts: offeringAccountsSetting?.items ?? [],
    adminName:
      (typeof adminNameSetting === "string" && adminNameSetting.trim()) ||
      CHURCH.pastorName.replace(/\s*목사\s*$/, ""),
    sections: normalizeLandingSections(landingSectionsSetting),
  };
}

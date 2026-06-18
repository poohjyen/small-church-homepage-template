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
import { FALLBACK_WORSHIP } from "@/components/sections/WorshipSection";
import { CHURCH } from "../../../church.config";
import type {
  Bulletin,
  Gallery,
  HeroSlide,
  MissionsCardValue,
  Notice,
  PastoralColumn,
  Resource,
  Sermon,
  SettingValueMap,
  WorshipScheduleItem,
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
  missionsCard: MissionsCardValue;
  worshipItems: WorshipScheduleItem[];
  yearMotto: SettingValueMap["year_motto"] | null;
  parallaxBands: SettingValueMap["parallax_bands"] | null;
  adminName: string;
  sections: LandingSectionConfig[];
};

const EMPTY_CONTACT: SettingValueMap["contact"] = {
  address: "",
  phone: "",
  account: "",
};

// 선교 카드 미설정 시 빈 값 (홈에서는 기본 미노출 — 더미 데이터 없음)
const EMPTY_MISSIONS_CARD: MissionsCardValue = {
  image_url: "",
  title: "",
  body: "",
  cta_label: "",
  cta_href: "",
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
    missionsCardSetting,
    worshipSetting,
    yearMottoSetting,
    parallaxBandsSetting,
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
    withFallback(
      getSiteSetting("missions_card"),
      null as SettingValueMap["missions_card"] | null,
    ),
    withFallback(
      getSiteSetting("worship_schedules"),
      null as SettingValueMap["worship_schedules"] | null,
    ),
    withFallback(
      getSiteSetting("year_motto"),
      null as SettingValueMap["year_motto"] | null,
    ),
    withFallback(
      getSiteSetting("parallax_bands"),
      null as SettingValueMap["parallax_bands"] | null,
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
    missionsCard: missionsCardSetting ?? EMPTY_MISSIONS_CARD,
    worshipItems: worshipSetting?.items?.length
      ? worshipSetting.items
      : FALLBACK_WORSHIP,
    yearMotto: yearMottoSetting,
    parallaxBands: parallaxBandsSetting,
    adminName:
      (typeof adminNameSetting === "string" && adminNameSetting.trim()) ||
      CHURCH.pastorName.replace(/\s*목사\s*$/, ""),
    sections: normalizeLandingSections(landingSectionsSetting),
  };
}

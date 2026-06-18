import { Fragment } from "react";
import Link from "next/link";

import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { SectionContainer } from "./SectionContainer";

type Accent = "navy" | "teal";

type HubItem = {
  title: string;
  description?: string;
  /* 예배안내처럼 라벨·시간이 줄마다 반복되는 경우 — 시간이 한 칸으로 정렬되도록 */
  schedule?: { label: string; time: string }[];
  href: string;
  accent: Accent;
  /* 매화풍 스태거: 카드별 배경 톤 + lg 높이 오프셋 */
  tone: string;
  offset: string;
};

const ACCENT_BAR: Record<Accent, string> = {
  navy: "before:bg-primary-navy",
  teal: "before:bg-secondary-sky",
};

function buildWorshipSchedule(
  schedules: SettingValueMap["worship_schedules"] | undefined,
): { label: string; time: string }[] {
  const items = schedules?.items ?? [];
  return items
    .slice(0, 4)
    .map((s) => ({ label: s.title, time: s.time ?? "" }));
}

function buildLocationDescription(
  contact: SettingValueMap["contact"] | undefined,
): string {
  const parts: string[] = [];
  if (contact?.address) parts.push(`주소: ${contact.address}`);
  if (contact?.phone) parts.push(`전화: ${contact.phone}`);
  return parts.join("\n") || "오시는 길을 안내합니다.";
}

export async function GreetingHubSection() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const motto = settings.year_motto as SettingValueMap["year_motto"] | undefined;
  const schedules = settings.worship_schedules as SettingValueMap["worship_schedules"] | undefined;
  const contact = settings.contact as SettingValueMap["contact"] | undefined;
  const pastorGreeting = settings.pastor_greeting as SettingValueMap["pastor_greeting"] | undefined;
  const greeting = pastorGreeting?.body
    ? pastorGreeting.body.slice(0, 100)
    : `${CHURCH.name}는 예배와 말씀과 기도로 하나님을 만나며, 이웃과 함께 복음으로 살아가는 공동체입니다.`;
  const worshipSchedule = buildWorshipSchedule(schedules);

  const HUB_ITEMS: HubItem[] = [
    {
      title: "환영인사",
      description: greeting,
      href: "/about",
      accent: "navy",
      tone: "bg-soft",
      offset: "lg:mt-10",
    },
    {
      title: "교회비전",
      description: motto?.motto ?? "함께 세워가는 신앙 공동체",
      href: "/about/vision",
      accent: "navy",
      tone: "bg-white",
      offset: "lg:mt-0",
    },
    {
      title: "예배안내",
      ...(worshipSchedule.length > 0
        ? { schedule: worshipSchedule }
        : { description: "예배 일정을 안내합니다." }),
      href: "/about/worship",
      accent: "teal",
      tone: "bg-soft",
      offset: "lg:mt-14",
    },
    {
      title: "오시는길",
      description: buildLocationDescription(contact),
      href: "/about/location",
      accent: "teal",
      tone: "bg-white",
      offset: "lg:mt-5",
    },
  ];

  return (
    <SectionContainer
      bg="white"
      className="py-0 md:py-0"
      containerClassName="relative z-10"
    >
      <ul className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:items-start lg:pb-12 md:-mt-8 lg:-mt-12">
        {HUB_ITEMS.map((item, i) => (
          <li key={item.href} className={item.offset}>
            <FadeIn delay={i * 80} className="h-full">
            <Link
              href={item.href}
              className={cn(
                "group relative flex h-full flex-col border border-black/5 p-6 shadow-[0_8px_24px_rgba(2,30,55,0.06)] transition hover:z-10 hover:shadow-lg active:bg-slate-50 active:border-secondary-sky/40 lg:p-8",
                item.tone,
                "before:absolute before:left-0 before:top-6 before:bottom-6 before:w-1",
                ACCENT_BAR[item.accent],
              )}
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-warm-gray">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-2xl font-medium text-primary-navy">
                {item.title}
              </h3>
              {item.schedule ? (
                <dl className="mt-3 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-2 text-sm leading-relaxed text-charcoal">
                  {item.schedule.map((s) => (
                    <Fragment key={s.label}>
                      <dt>{s.label}</dt>
                      <dd className="tabular-nums text-warm-gray">{s.time}</dd>
                    </Fragment>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 whitespace-pre-line text-sm leading-loose text-charcoal">
                  {item.description}
                </p>
              )}
              <div className="mt-auto pt-6">
                {/* 카드 전체가 <Link>라 내부에 <a>를 중첩할 수 없음 — MoreLink와 동일한 모양의 span */}
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-navy underline-offset-4 transition-colors group-hover:underline">
                  <span>자세히 보기</span>
                  <span aria-hidden className="ml-0.5 leading-none">》</span>
                </span>
              </div>
            </Link>
            </FadeIn>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

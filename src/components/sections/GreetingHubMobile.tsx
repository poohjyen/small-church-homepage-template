import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { SectionContainer } from "./SectionContainer";

type Item = {
  title: string;
  description: string;
  href: string;
  bar: string;
};

function buildWorshipShort(
  schedules: SettingValueMap["worship_schedules"] | undefined,
): string {
  const items = schedules?.items ?? [];
  if (items.length === 0) return "예배 일정 안내";
  return items
    .slice(0, 3)
    .map((s) => `${s.title} ${s.time}`.trim())
    .join(" / ");
}

function buildLocationShort(
  contact: SettingValueMap["contact"] | undefined,
): string {
  const parts: string[] = [];
  if (contact?.address) parts.push(contact.address);
  if (contact?.phone) parts.push(contact.phone);
  return parts.join(" / ") || "오시는 길 안내";
}

export async function GreetingHubMobile() {
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
    ? pastorGreeting.body.slice(0, 80)
    : "예배와 말씀, 기도와 사랑으로 함께 자라가는 신앙 공동체입니다.";

  const ITEMS: Item[] = [
    {
      title: "환영인사",
      description: greeting,
      href: "/about",
      bar: "bg-primary-navy",
    },
    {
      title: "교회비전",
      description: motto?.motto ?? "함께 세워가는 신앙 공동체",
      href: "/about/vision",
      bar: "bg-primary-navy",
    },
    {
      title: "예배안내",
      description: buildWorshipShort(schedules),
      href: "/about/worship",
      bar: "bg-secondary-sky",
    },
    {
      title: "오시는길",
      description: buildLocationShort(contact),
      href: "/about/location",
      bar: "bg-accent-coral",
    },
  ];

  return (
    <SectionContainer bg="white" className="py-12">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-secondary-sky">
          WELCOME
        </p>
        <h2 className="mt-2 text-2xl font-bold text-primary-navy">
          환영합니다
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-loose text-charcoal">
          {CHURCH.name} 홈페이지를 찾아주신 모든 분들을 진심으로 환영합니다.
        </p>
      </div>

      <ul className="mx-auto mt-7 max-w-md divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition active:bg-slate-50"
            >
              <span
                className={cn("h-8 w-1 shrink-0 rounded-full", item.bar)}
                aria-hidden
              />
              <span className="flex-1">
                <span className="block text-[17px] font-bold text-primary-navy">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-sm text-warm-gray">
                  {item.description}
                </span>
              </span>
              <ChevronRight className="size-5 text-warm-gray" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
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
    .slice(0, 4)
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
    : `${CHURCH.name}는 예배와 말씀, 기도와 사랑으로 함께 자라가는 신앙 공동체입니다.`;

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
      bar: "bg-secondary-sky",
    },
  ];

  return (
    <SectionContainer bg="white" className="py-4">
      <SectionHeading eyebrow="WELCOME" title="환영합니다" />

      <ul className="mx-auto mt-7 max-w-md divide-y divide-black/5 border-y border-slate-200 bg-white">
        {ITEMS.map((item, i) => (
          <li key={item.href}>
            <FadeIn delay={i * 80}>
            <Link
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition active:bg-slate-50"
            >
              <span
                className={cn("h-8 w-1 shrink-0", item.bar)}
                aria-hidden
              />
              <span className="flex-1">
                <span className="block text-[17px] font-medium text-primary-navy">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-sm text-warm-gray">
                  {item.description}
                </span>
              </span>
              <ChevronRight className="size-5 text-warm-gray" aria-hidden />
            </Link>
            </FadeIn>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

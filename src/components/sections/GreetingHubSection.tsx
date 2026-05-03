import Link from "next/link";

import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { SectionContainer } from "./SectionContainer";

type Accent = "navy" | "teal" | "coral";

type HubItem = {
  title: string;
  description: string;
  href: string;
  accent: Accent;
};

const ACCENT_BAR: Record<Accent, string> = {
  navy: "before:bg-primary-navy",
  teal: "before:bg-secondary-sky",
  coral: "before:bg-accent-coral",
};

function buildWorshipDescription(
  schedules: SettingValueMap["worship_schedules"] | undefined,
): string {
  const items = schedules?.items ?? [];
  if (items.length === 0) return "예배 일정을 안내합니다.";
  return items
    .slice(0, 3)
    .map((s) => `${s.title} ${s.time}`.trim())
    .join("\n");
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

  const HUB_ITEMS: HubItem[] = [
    {
      title: "환영인사",
      description: greeting,
      href: "/about",
      accent: "navy",
    },
    {
      title: "교회비전",
      description: motto?.motto ?? "함께 세워가는 신앙 공동체",
      href: "/about/vision",
      accent: "navy",
    },
    {
      title: "예배안내",
      description: buildWorshipDescription(schedules),
      href: "/about/worship",
      accent: "teal",
    },
    {
      title: "오시는길",
      description: buildLocationDescription(contact),
      href: "/about/location",
      accent: "coral",
    },
  ];

  return (
    <SectionContainer bg="white">
      <SectionHeading eyebrow="WELCOME" title="환영합니다" />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-5">
        {HUB_ITEMS.map((item, i) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "group relative flex h-full flex-col rounded-2xl bg-white p-8 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg",
                "before:absolute before:left-0 before:top-6 before:bottom-6 before:w-1 before:rounded-r",
                ACCENT_BAR[item.accent],
              )}
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-warm-gray">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-2xl font-bold text-primary-navy">
                {item.title}
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-loose text-charcoal">
                {item.description}
              </p>
              <div className="mt-auto pt-6">
                <MoreLink href={item.href} tone="navy" size="sm">
                  자세히 보기
                </MoreLink>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

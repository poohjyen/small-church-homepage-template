import Link from "next/link";
import { HandHelping, HeartHandshake, UserPlus } from "lucide-react";

import { ParallaxBackdrop } from "@/components/sections/ParallaxBackdrop";
import { cn } from "@/lib/utils";

type Action = {
  title: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const ACTIONS: Action[] = [
  {
    title: "기도 요청",
    href: "/forms/prayer",
    Icon: HandHelping,
  },
  {
    title: "심방 요청",
    href: "/forms/visit",
    Icon: HeartHandshake,
  },
  {
    title: "새가족 등록",
    href: "/forms/newcomer",
    Icon: UserPlus,
  },
];

export function QuickActionsSection({ bgImage }: { bgImage?: string } = {}) {
  const body = (
    <section
      aria-label="빠른 신청"
      className={cn(
        "relative py-5 text-white md:py-7",
        !bgImage && "bg-secondary-sky",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]"
      />
      <div className="container relative mx-auto px-4">
        <ul className="grid grid-cols-3 gap-3 md:gap-6">
          {ACTIONS.map(({ title, href, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex flex-col items-center text-center"
              >
                <span className="grid size-10 place-items-center rounded-full bg-white/15 text-white ring-2 ring-white/30 transition group-hover:bg-white group-hover:text-secondary-sky group-hover:ring-white group-active:bg-white group-active:text-secondary-sky md:size-14">
                  <Icon className="size-5 md:size-7" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-bold md:mt-4 md:text-xl">
                  {title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  if (!bgImage) return body;

  // 사진 배경 + 청록 오버레이 (인접 남색 띠와 색 대비를 위해 청록 유지)
  return (
    <ParallaxBackdrop image={bgImage} overlayClassName="bg-secondary-sky/85">
      {body}
    </ParallaxBackdrop>
  );
}

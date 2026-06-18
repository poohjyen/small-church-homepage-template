"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { NaverBandIcon } from "@/components/icons/NaverBandIcon";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./MobileNav";
import { NAV_GROUPS, type NavGroup } from "./nav-data";
import type { SettingValueMap } from "@/types/database";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const CLOSE_DELAY_MS = 150;

type Sns = SettingValueMap["sns"];

function HoverMenu({ group }: { group: NavGroup }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstHref = group.children[0]?.href;
  const isActive = group.children.some(
    (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
  );

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleClose() {
    clearTimer();
    timerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function openNow() {
    clearTimer();
    setOpen(true);
  }

  useEffect(() => () => clearTimer(), []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            onMouseEnter={openNow}
            onMouseLeave={scheduleClose}
            onFocus={openNow}
            onBlur={scheduleClose}
            onClick={() => {
              if (firstHref) {
                setOpen(false);
                router.push(firstHref);
              }
            }}
            className={cn(
              "group relative cursor-pointer whitespace-nowrap px-2 py-2 text-[16px] font-bold transition hover:text-white data-[popup-open]:text-white lg:px-3 lg:text-[18px] xl:px-4 xl:text-[19px]",
              "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:origin-center after:scale-x-0 after:bg-white after:transition-transform after:content-[''] hover:after:scale-x-100 data-[popup-open]:after:scale-x-100 lg:after:left-3 lg:after:right-3 xl:after:left-4 xl:after:right-4",
              isActive ? "text-white after:scale-x-100" : "text-white/85",
            )}
          />
        }
      >
        {group.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={2}
        className="w-auto min-w-[200px] rounded-t-none rounded-b-md border-t-[3px] border-t-secondary-sky bg-white px-0 py-2 shadow-[0_12px_28px_rgba(2,86,125,0.16)] ring-1 ring-slate-200"
        onPointerEnter={clearTimer}
        onPointerLeave={scheduleClose}
      >
        {group.children.map((c) => {
          const childActive =
            pathname === c.href || pathname.startsWith(`${c.href}/`);
          return (
            <DropdownMenuItem
              key={c.href}
              render={<Link href={c.href} />}
              className={cn(
                "rounded-none px-5 py-2.5 text-[15px] font-medium transition",
                "hover:bg-secondary-sky/10 hover:text-secondary-sky focus:bg-secondary-sky/10 focus:text-secondary-sky data-[highlighted]:bg-secondary-sky/10 data-[highlighted]:text-secondary-sky",
                childActive && "bg-secondary-sky/10 text-secondary-sky",
              )}
            >
              {c.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderClient({ sns }: { sns: Sns }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 히스테리시스: 켜짐(>72)·꺼짐(<16) 임계값을 분리한다.
    // 스크롤 시 상단 SNS 바가 접히며 헤더 높이가 ~36px 줄고, 브라우저
    // 스크롤 앵커링이 scrollY를 그만큼 되돌리는데, 단일 임계값이면 그 반동이
    // 경계를 다시 넘어 접힘/펴짐이 무한 반복(떨림)된다. 간격(56px)을 접힘
    // 높이보다 크게 두어 한 번 넘으면 반동으로 되돌아오지 않게 한다.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > 72) return true;
        if (prev && y < 16) return false;
        return prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-white/10 bg-primary-navy shadow-[0_2px_12px_rgba(0,0,0,0.28)] backdrop-blur"
          : "border-b border-transparent bg-primary-navy/90 backdrop-blur",
      )}
    >
      <div
        className={cn(
          "hidden overflow-hidden border-b border-slate-200 bg-white transition-[max-height,opacity] duration-300 min-[992px]:block",
          scrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-9 opacity-100",
        )}
      >
        <div className="container mx-auto flex h-9 items-center justify-end gap-1 px-4">
          {sns.youtube ? (
            <Link
              href={sns.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} YouTube`}
              title="YouTube"
              className="inline-flex size-7 items-center justify-center rounded-full text-warm-gray transition hover:bg-slate-100 hover:text-primary-navy"
            >
              <YoutubeIcon className="size-4" />
            </Link>
          ) : null}
          {sns.instagram ? (
            <Link
              href={sns.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} Instagram`}
              title="Instagram"
              className="inline-flex size-7 items-center justify-center rounded-full text-warm-gray transition hover:bg-slate-100 hover:text-primary-navy"
            >
              <InstagramIcon className="size-4" />
            </Link>
          ) : null}
          {sns.band ? (
            <Link
              href={sns.band}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} 네이버 밴드`}
              title="네이버 밴드"
              className="inline-flex size-7 items-center justify-center rounded-full bg-[#00C73C]/10 text-[#00C73C] ring-1 ring-[#00C73C]/30 transition hover:bg-[#00C73C]/15 hover:ring-[#00C73C]/50"
            >
              <NaverBandIcon className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto flex h-12 items-center justify-between gap-4 px-4 md:h-16 min-[992px]:h-20">
        <Link href="/" aria-label={`${SITE.name} 홈`} className="flex shrink-0 items-center">
          {SITE.logo.endsWith(".svg") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={SITE.logo}
              alt={SITE.name}
              className="h-9 w-auto md:h-11 min-[992px]:h-12"
            />
          ) : (
            <Image
              src={SITE.logo}
              alt={SITE.name}
              width={2095}
              height={522}
              preload
              className="h-9 w-auto md:h-11 min-[992px]:h-12"
            />
          )}
        </Link>

        <nav className="hidden flex-nowrap items-center gap-0.5 whitespace-nowrap min-[992px]:flex min-[992px]:gap-3 xl:gap-6">
          {NAV_GROUPS.map((group) => (
            <HoverMenu key={group.label} group={group} />
          ))}
        </nav>

        <div className="min-[992px]:hidden">
          <MobileNav />
        </div>
      </div>

      <MobileTopNav />
    </header>
  );
}

function MobileTopNav() {
  const pathname = usePathname() ?? "";
  const activeGroupLabel = NAV_GROUPS.find((g) =>
    g.children.some(
      (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
    ),
  )?.label;

  return (
    <nav aria-label="모바일 카테고리" className="border-t border-white/15 min-[992px]:hidden">
      <ul className="scrollbar-none flex gap-5 overflow-x-auto whitespace-nowrap px-4">
        {NAV_GROUPS.map((group) => {
          const firstHref = group.children[0]?.href ?? "/";
          const isActive = activeGroupLabel === group.label;
          return (
            <li key={group.label} className="shrink-0">
              <Link
                href={firstHref}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center border-b-2 px-1 pb-2 pt-2.5 text-[15px] font-bold transition",
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-white/80 hover:text-white",
                )}
              >
                {group.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

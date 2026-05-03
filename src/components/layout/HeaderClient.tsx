"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { NaverBandIcon } from "@/components/icons/NaverBandIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
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
import { CHURCH } from "../../../church.config";

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
              "relative whitespace-nowrap rounded-md px-2 py-2 text-[16px] font-bold transition hover:text-secondary-sky data-[popup-open]:text-secondary-sky lg:px-3 lg:text-[18px] xl:px-4 xl:text-[19px]",
              isActive
                ? "text-secondary-sky after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-secondary-sky after:content-[''] lg:after:left-3 lg:after:right-3 xl:after:left-4 xl:after:right-4"
                : "text-charcoal",
            )}
          />
        }
      >
        {group.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={8}
        className="min-w-44"
        onPointerEnter={clearTimer}
        onPointerLeave={scheduleClose}
      >
        {group.children.map((c) => (
          <DropdownMenuItem
            key={c.href}
            render={<Link href={c.href} />}
            className="px-3 py-2 text-base transition hover:text-secondary-sky focus:text-secondary-sky data-[highlighted]:text-secondary-sky"
          >
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderClient({ sns }: { sns: Sns }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "border-b border-slate-200 bg-white/95 backdrop-blur"
          : "bg-white/80 backdrop-blur",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-24">
        <Link href="/" aria-label={`${CHURCH.name} 홈`} className="flex items-center">
          {CHURCH.logo.endsWith(".svg") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={CHURCH.logo}
              alt={CHURCH.name}
              className="h-12 w-auto md:h-16"
            />
          ) : (
            <Image
              src={CHURCH.logo}
              alt={CHURCH.name}
              width={2095}
              height={522}
              preload
              className="h-12 w-auto md:h-16"
            />
          )}
        </Link>

        <nav className="hidden flex-nowrap items-center gap-0.5 whitespace-nowrap md:flex lg:gap-1.5 xl:gap-3">
          {NAV_GROUPS.map((group) => (
            <HoverMenu key={group.label} group={group} />
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          {sns.youtube ? (
            <Link
              href={sns.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${CHURCH.name} YouTube`}
              title="YouTube"
              className="inline-flex size-9 items-center justify-center rounded-full text-warm-gray transition hover:bg-slate-100 hover:text-primary-navy"
            >
              <PlayCircle className="size-5" aria-hidden />
            </Link>
          ) : null}
          {sns.band ? (
            <Link
              href={sns.band}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${CHURCH.name} 네이버 밴드`}
              title="네이버 밴드"
              className="inline-flex size-9 items-center justify-center rounded-full bg-[#00C73C]/10 text-[#00C73C] ring-1 ring-[#00C73C]/30 transition hover:bg-[#00C73C]/15 hover:ring-[#00C73C]/50"
            >
              <NaverBandIcon className="size-5" />
            </Link>
          ) : null}
          {sns.instagram ? (
            <Link
              href={sns.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${CHURCH.name} Instagram`}
              title="Instagram"
              className="inline-flex size-9 items-center justify-center rounded-full text-warm-gray transition hover:bg-slate-100 hover:text-primary-navy"
            >
              <InstagramIcon className="size-5" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="md:hidden">
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
    <nav aria-label="모바일 카테고리" className="border-t border-slate-200 md:hidden">
      <ul className="scrollbar-none flex gap-1 overflow-x-auto whitespace-nowrap px-3 py-2">
        {NAV_GROUPS.map((group) => {
          const firstHref = group.children[0]?.href ?? "/";
          const isActive = activeGroupLabel === group.label;
          return (
            <li key={group.label} className="shrink-0">
              <Link
                href={firstHref}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full px-3 py-1.5 text-[15px] font-bold transition",
                  isActive
                    ? "bg-secondary-sky/10 text-secondary-sky"
                    : "text-charcoal active:bg-slate-100",
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

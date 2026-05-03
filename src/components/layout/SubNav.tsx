"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavChild } from "./nav-data";

export function SubNav() {
  const pathname = usePathname();
  if (!pathname) return null;

  const match = findMatchingGroup(pathname);
  if (!match) return null;
  const { group, activeHref } = match;
  if (group.children.length < 2) return null;

  return (
    <nav
      aria-label={`${group.label} 하위 메뉴`}
      className="bg-secondary-sky shadow-[0_1px_0_rgba(0,0,0,0.04)]"
    >
      <ul className="container mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-2.5 md:gap-x-8 md:py-3">
        {group.children.map((c) => {
          const active = c.href === activeHref;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center border-b-2 px-1 pb-0.5 pt-1 text-sm transition md:text-[15px]",
                  active
                    ? "border-white font-bold text-white"
                    : "border-transparent font-semibold text-white/80 hover:text-white",
                )}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function findMatchingGroup(pathname: string) {
  for (const group of NAV_GROUPS) {
    const active = findActiveChild(pathname, group.children);
    if (active) return { group, activeHref: active.href };
  }
  return null;
}

function findActiveChild(pathname: string, children: NavChild[]) {
  const exact = children.find((c) => c.href === pathname);
  if (exact) return exact;

  let best: NavChild | undefined;
  let bestLen = 0;
  for (const c of children) {
    if (pathname.startsWith(`${c.href}/`) && c.href.length > bestLen) {
      best = c;
      bestLen = c.href.length;
    }
  }
  return best;
}

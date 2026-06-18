"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { NAV_GROUPS, type NavChild } from "./nav-data";

export function SubNav() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLLIElement | null>(null);

  const match = pathname ? findMatchingGroup(pathname) : null;
  const activeHref = match?.activeHref;

  useEffect(() => {
    if (!activeRef.current) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    activeRef.current.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "auto",
    });
  }, [activeHref]);

  if (!pathname) return null;
  if (!match) return null;
  const { group } = match;
  if (group.children.length < 2) return null;

  return (
    <nav
      aria-label={`${group.label} 하위 메뉴`}
      className={cn(
        // 모바일: 라이트 슬레이트 바
        "border-b border-slate-200 bg-slate-50",
        // 데스크톱: 기존 sky 솔리드 + 미세 라인
        "md:border-b-0 md:bg-secondary-sky md:shadow-[0_1px_0_rgba(0,0,0,0.04)]",
      )}
    >
      <div className="container mx-auto px-2 py-1.5 md:px-4 md:py-2.5">
        <ul
          className={cn(
            // 모바일: 가로 스크롤, 잘림 없이 자연 폭, 스크롤바 숨김
            "scrollbar-none flex w-full items-stretch gap-1 overflow-x-auto whitespace-nowrap",
            // 데스크톱: 자연 폭 + 중앙 정렬 (스크롤 비활성, 줄바꿈 복원)
            "md:justify-center md:gap-3 md:overflow-visible md:whitespace-normal",
          )}
        >
          {group.children.map((c) => {
            const active = c.href === activeHref;
            return (
              <li
                key={c.href}
                ref={active ? activeRef : undefined}
                className="shrink-0"
              >
                <Link
                  href={c.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block text-center text-sm font-semibold transition",
                    // 모바일: 직각 사각, 패딩
                    "px-3 py-2",
                    // 데스크톱: 라운드 pill, 더 큰 패딩
                    "md:rounded-full md:px-5 md:py-2 md:text-[15px]",
                    active
                      ? cn(
                          // 모바일 활성: sky 솔리드 사각
                          "bg-secondary-sky text-white",
                          // 데스크톱 활성: 흰 라운드 pill
                          "md:bg-white md:text-secondary-sky md:shadow-sm",
                        )
                      : cn(
                          // 모바일 비활성: 회색 텍스트, hover 흰 배경
                          "text-warm-gray hover:bg-white hover:text-primary-navy",
                          // 데스크톱 비활성: sky bg 위 흰 톤
                          "md:bg-transparent md:text-white/85 md:hover:bg-white/10 md:hover:text-white",
                        ),
                  )}
                >
                  {c.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
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

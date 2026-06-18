"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { NAV_GROUPS } from "./nav-data";

type Props = {
  onNavigate?: () => void;
};

export function SideNavBody({ onNavigate }: Props) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const pathname = usePathname() ?? "";

  return (
    <nav className="px-3 pb-6 pt-3">
      {NAV_GROUPS.map((group) => {
        const isOpen = openLabel === group.label;
        const firstHref = group.children[0]?.href ?? "#";
        const hasMultiple = group.children.length > 1;
        const groupActive = group.children.some(
          (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
        );
        return (
          <div key={group.label} className="py-0.5">
            <div className="flex items-stretch">
              <Link
                href={firstHref}
                onClick={() => {
                  onNavigate?.();
                  setOpenLabel(null);
                }}
                className={cn(
                  "flex-1 rounded-md px-3 py-3 text-[17px] font-medium transition active:bg-slate-50",
                  groupActive
                    ? "text-secondary-sky"
                    : "text-primary-navy hover:text-secondary-sky",
                )}
              >
                {group.label}
              </Link>
              {hasMultiple ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${group.label} 하위 메뉴 ${isOpen ? "접기" : "펼치기"}`}
                  onClick={() =>
                    setOpenLabel((prev) =>
                      prev === group.label ? null : group.label,
                    )
                  }
                  className="flex items-center rounded-md px-3 text-warm-gray transition hover:text-primary-navy active:bg-slate-50"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isOpen && "rotate-180 text-primary-navy",
                    )}
                    aria-hidden
                  />
                </button>
              ) : null}
            </div>
            {isOpen && hasMultiple ? (
              <ul className="mt-1 space-y-0.5 pl-3">
                {group.children.map((c) => {
                  const childActive =
                    pathname === c.href || pathname.startsWith(`${c.href}/`);
                  return (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={() => {
                          onNavigate?.();
                          setOpenLabel(null);
                        }}
                        className={cn(
                          "inline-block rounded-full px-3.5 py-1.5 text-[14.5px] font-medium transition",
                          childActive
                            ? "bg-secondary-sky/10 text-secondary-sky"
                            : "text-charcoal hover:bg-slate-100 hover:text-primary-navy",
                        )}
                      >
                        {c.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

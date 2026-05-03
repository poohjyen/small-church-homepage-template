"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "./nav-data";
import { CHURCH } from "../../../church.config";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="메뉴 열기"
            className="size-10 rounded-full bg-primary-navy text-white shadow-sm hover:bg-primary-navy-dark hover:text-white"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 max-w-[80vw] gap-0 overflow-y-auto p-0 [&>[data-slot=sheet-close]]:text-white [&>[data-slot=sheet-close]]:hover:bg-white/10"
      >
        <SheetHeader className="bg-primary-navy px-5 py-5">
          <SheetTitle className="text-lg font-bold text-white">
            {CHURCH.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="px-2 pb-6 pt-2">
          {NAV_GROUPS.map((group) => {
            const isOpen = openLabel === group.label;
            const firstHref = group.children[0]?.href ?? "#";
            const hasMultiple = group.children.length > 1;
            return (
              <div
                key={group.label}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-stretch">
                  <Link
                    href={firstHref}
                    onClick={() => {
                      setOpen(false);
                      setOpenLabel(null);
                    }}
                    className="flex-1 px-3 py-3.5 text-lg font-bold text-primary-navy transition active:bg-slate-50"
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
                      className="flex items-center px-4 transition active:bg-slate-50"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 text-warm-gray transition-transform",
                          isOpen && "rotate-180 text-primary-navy",
                        )}
                        aria-hidden
                      />
                    </button>
                  ) : null}
                </div>
                {isOpen && hasMultiple ? (
                  <ul className="bg-slate-50 pb-2">
                    {group.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => {
                            setOpen(false);
                            setOpenLabel(null);
                          }}
                          className="block px-7 py-2 text-[15px] text-charcoal transition hover:text-primary-navy active:bg-slate-100"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

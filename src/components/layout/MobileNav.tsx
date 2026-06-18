"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

import { SideNavBody } from "./SideNavBody";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="메뉴 열기"
            className="size-10 rounded-full bg-white/15 text-white shadow-sm hover:bg-white/25 hover:text-white"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 max-w-[80vw] gap-0 overflow-y-auto bg-white p-0 [&>[data-slot=sheet-close]]:text-warm-gray [&>[data-slot=sheet-close]]:hover:bg-slate-100"
      >
        <SheetHeader className="border-b border-slate-100 bg-white px-5 py-5">
          <SheetTitle className="text-xl font-bold tracking-tight text-primary-navy">
            {SITE.name}
          </SheetTitle>
        </SheetHeader>
        <SideNavBody onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

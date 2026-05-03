"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { CHURCH } from "../../../church.config";

export function AdminMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="메뉴 열기">
            <Menu className="size-5" aria-hidden />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 bg-white p-0 dark:bg-card">
        <div className="flex h-full flex-col">
          <div className="border-b border-black/5 px-5 py-4 dark:border-border">
            <SheetTitle className="text-base font-bold text-primary-navy dark:text-foreground">
              {CHURCH.name} 관리자
            </SheetTitle>
            <SheetDescription className="sr-only">
              관리자 메뉴
            </SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <AdminSidebarNav onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-black/5 p-3 dark:border-border">
            <AdminLogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

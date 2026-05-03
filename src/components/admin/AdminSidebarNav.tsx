"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ADMIN_TOP_ITEM,
  ADMIN_NAV_GROUPS,
  type AdminNavItem,
} from "./nav-data";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary-navy text-white dark:bg-primary dark:text-primary-foreground"
          : "text-charcoal hover:bg-primary-navy/5 hover:text-primary-navy dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminSidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "";

  return (
    <nav className="flex flex-col gap-6">
      <div>
        <NavLink
          item={ADMIN_TOP_ITEM}
          active={isActive(pathname, ADMIN_TOP_ITEM.href)}
          onNavigate={onNavigate}
        />
      </div>

      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-warm-gray dark:text-muted-foreground">
            {group.label}
          </p>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

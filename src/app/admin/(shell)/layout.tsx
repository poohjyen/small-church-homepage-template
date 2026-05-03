import Link from "next/link";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminMobileSidebar } from "@/components/admin/AdminMobileSidebar";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { CHURCH } from "../../../../church.config";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-soft dark:bg-background">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/5 bg-white md:flex dark:border-border dark:bg-card">
          <div className="flex h-16 items-center justify-between border-b border-black/5 px-5 dark:border-border">
            <Link
              href="/admin"
              className="text-base font-bold tracking-tight text-primary-navy dark:text-foreground"
            >
              {CHURCH.name} 관리자
            </Link>
            <AdminThemeToggle />
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-6">
            <AdminSidebarNav />
          </div>
          <div className="border-t border-black/5 p-3 dark:border-border">
            <AdminLogoutButton />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/5 bg-white/95 px-4 backdrop-blur md:hidden dark:border-border dark:bg-card/95">
            <AdminMobileSidebar />
            <Link
              href="/admin"
              className="text-sm font-bold text-primary-navy dark:text-foreground"
            >
              {CHURCH.name} 관리자
            </Link>
            <AdminThemeToggle />
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

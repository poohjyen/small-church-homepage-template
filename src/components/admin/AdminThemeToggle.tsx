"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const subscribeNoop = () => () => {};

export function AdminThemeToggle({ className }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  // SSR/hydration: 클라이언트에 마운트된 후에만 테마 의존 UI 노출
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드" : "다크 모드"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-warm-gray transition hover:bg-soft hover:text-foreground dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}

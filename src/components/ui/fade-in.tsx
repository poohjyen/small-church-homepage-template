"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
};

const HIDDEN: Record<Direction, string> = {
  up: "opacity-0 translate-y-8",
  down: "opacity-0 -translate-y-8",
  left: "opacity-0 translate-x-8",
  right: "opacity-0 -translate-x-8",
  none: "opacity-0",
};

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0",
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : HIDDEN[direction],
        className,
      )}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type Direction = "up" | "down" | "left" | "right" | "zoom" | "none";

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
};

// 부드러운 등장: 24px 사뿐히 떠오름(up) + 살짝 확대(zoom). 거리/이징/지속은 아래 className 한 곳에서 조절
const HIDDEN: Record<Direction, string> = {
  up: "opacity-0 translate-y-6",
  down: "opacity-0 -translate-y-6",
  left: "opacity-0 translate-x-6",
  right: "opacity-0 -translate-x-6",
  zoom: "opacity-0 scale-95",
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
      // 요소 상단이 뷰포트 하단에서 40px 들어오면 바로 트리거 (스크롤 체감상 즉시 등장)
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-[720ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100",
        visible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : HIDDEN[direction],
        className,
      )}
    >
      {children}
    </div>
  );
}

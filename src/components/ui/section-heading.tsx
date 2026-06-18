import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  eyebrowCase?: "upper" | "none";
  /* dark: 네이비 밴드 등 어두운 배경 위에서 사용 */
  tone?: "light" | "dark";
  /* lg: 비전 띠처럼 히어로급 밴드의 대형 제목 */
  size?: "md" | "lg";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  eyebrowCase = "upper",
  tone = "light",
  size = "md",
  className,
}: Props) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.4em] text-secondary-sky md:text-sm",
            eyebrowCase === "upper" && "uppercase",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-bold",
          size === "lg"
            ? "text-3xl leading-tight md:text-5xl"
            : "text-3xl md:text-4xl",
          tone === "dark" ? "text-white" : "text-primary-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg",
            tone === "dark" ? "text-white/85" : "text-warm-gray",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

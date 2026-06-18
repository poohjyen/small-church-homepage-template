"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

type Props = {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  height?: "sm" | "md";
  align?: "center" | "left";
};

export function ParallaxHero({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  cta,
  height = "md",
  align = "center",
}: Props) {
  const safeUrl = image.replace(/["\\\n\r]/g, "");

  const sizeClass =
    height === "sm"
      ? "h-[18svh] min-h-[140px] md:h-[40svh] md:min-h-[320px]"
      : "h-[27svh] min-h-[200px] md:h-[62svh] md:min-h-[480px]";

  const hasText = Boolean(eyebrow || title || subtitle || cta);

  return (
    <section
      aria-label={title || imageAlt || undefined}
      className={cn(
        "relative isolate w-full overflow-hidden bg-primary-navy",
        sizeClass,
      )}
    >
      {/* 배경 레이어: PC는 bg-fixed로 뷰포트에 고정(스크롤 시 사진은 멈추고 글자만 위로 지나감),
          모바일은 bg-scroll + ken-burns 줌(bg-fixed는 iOS에서 깨지므로 미적용) */}
      <div
        aria-hidden
        style={{ backgroundImage: `url("${safeUrl}")` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll motion-safe:md:bg-fixed max-md:animate-ken-burns"
      />

      {/* 은은한 흑백: 채도만 빼는 블렌드 오버레이. opacity로 흑백 강도 조절(↑ 더 흑백 / ↓ 더 컬러).
          ※ 배경 div에 filter를 직접 걸면 PC bg-fixed 패럴럭스가 깨지므로 반드시 별도 오버레이로 처리 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-neutral-500 mix-blend-saturation opacity-[0.35]"
      />

      {hasText ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60"
          />

          <div
            className={cn(
              "absolute inset-0 flex justify-center px-4",
              align === "center" ? "items-center text-center" : "items-start text-left",
            )}
          >
            <FadeIn
              direction="down"
              className={cn(
                "container mx-auto flex w-full flex-col gap-3",
                align === "center" ? "items-center" : "items-start",
              )}
            >
              {eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary-sky md:text-sm">
                  {eyebrow}
                </p>
              ) : null}

              {title ? (
                <>
                  <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl [text-shadow:_0_2px_12px_rgba(0,0,0,0.45)]">
                    {title}
                  </h2>

                  <div
                    aria-hidden
                    className={cn(
                      "mt-1 flex w-full items-center gap-3",
                      align === "center" ? "mx-auto" : "",
                    )}
                  >
                    <span className="h-px flex-1 bg-white/60" />
                    <span className="size-1.5 rounded-full bg-white" />
                    <span className="h-px flex-1 bg-white/60" />
                  </div>
                </>
              ) : null}

              {subtitle ? (
                <p
                  className={cn(
                    "max-w-2xl text-base leading-relaxed text-white/85 md:text-lg [text-shadow:_0_1px_8px_rgba(0,0,0,0.4)]",
                    align === "center" ? "mx-auto" : "",
                  )}
                >
                  {subtitle}
                </p>
              ) : null}

              {cta ? (
                <Link
                  href={cta.href}
                  className="mt-2 inline-flex items-center gap-2 bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary-navy shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-white"
                >
                  {cta.label}
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </FadeIn>
          </div>
        </>
      ) : null}
    </section>
  );
}

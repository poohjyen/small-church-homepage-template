import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  breadcrumb?: Crumb[];
  height?: "sm" | "md";
  align?: "center" | "left";
  variant?: "photo" | "plain";
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumb,
  height = "md",
  align = "center",
  variant,
}: Props) {
  const resolved: "photo" | "plain" = variant ?? (image ? "photo" : "plain");

  if (resolved === "plain") {
    return (
      <section
        aria-label={title}
        className="relative w-full overflow-hidden border-b border-slate-200 bg-slate-50"
      >
        <div
          className={cn(
            "container mx-auto flex flex-col gap-2 px-4 py-8 md:gap-3 md:py-12",
            align === "center" ? "items-center text-center" : "items-start text-left",
          )}
        >
          {breadcrumb && breadcrumb.length > 0 ? (
            <nav aria-label="페이지 위치">
              <ol
                className={cn(
                  "flex flex-wrap items-center gap-x-2 text-xs text-warm-gray md:text-sm",
                  align === "center" ? "justify-center" : "justify-start",
                )}
              >
                <li>
                  <Link href="/" className="hover:text-primary-navy">
                    홈
                  </Link>
                </li>
                {breadcrumb.map((c, i) => (
                  <li key={`${c.label}-${i}`} className="flex items-center gap-x-2">
                    <span aria-hidden className="text-slate-300">
                      ·
                    </span>
                    {c.href ? (
                      <Link href={c.href} className="hover:text-primary-navy">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-primary-navy" aria-current="page">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary-sky md:text-sm">
            {eyebrow}
          </p>

          <h1 className="text-3xl font-bold leading-tight text-primary-navy md:text-5xl">
            {title}
          </h1>

          <div
            aria-hidden
            className={cn(
              "mt-1 flex w-full items-center gap-3",
              align === "center" ? "mx-auto" : "",
            )}
          >
            <span className="h-px flex-1 bg-secondary-sky/60" />
            <span className="size-1.5 rounded-full bg-secondary-sky" />
            <span className="h-px flex-1 bg-secondary-sky/60" />
          </div>

          {description ? (
            <p
              className={cn(
                "max-w-2xl text-sm leading-relaxed text-warm-gray md:text-base",
                align === "center" ? "mx-auto" : "",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  const sizeClass =
    height === "sm"
      ? "h-[18svh] min-h-[140px] md:h-[40svh] md:min-h-[320px]"
      : "h-[22svh] min-h-[160px] md:h-[48svh] md:min-h-[380px]";

  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section
      aria-label={title}
      className={cn("relative w-full overflow-hidden bg-primary-navy", sizeClass)}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="100vw"
            preload
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy to-secondary-sky/40"
        />
      )}

      <div
        className={cn(
          "absolute inset-0 flex justify-center px-4",
          alignClass,
        )}
      >
        <div
          className={cn(
            "container mx-auto flex w-full flex-col gap-3",
            align === "center" ? "items-center" : "items-start",
          )}
        >
          {breadcrumb && breadcrumb.length > 0 ? (
            <nav aria-label="페이지 위치">
              <ol
                className={cn(
                  "flex flex-wrap items-center gap-x-2 text-xs text-white/75 md:text-sm",
                  align === "center" ? "justify-center" : "justify-start",
                )}
              >
                <li>
                  <Link href="/" className="hover:text-white">
                    홈
                  </Link>
                </li>
                {breadcrumb.map((c, i) => (
                  <li key={`${c.label}-${i}`} className="flex items-center gap-x-2">
                    <span aria-hidden className="text-white/40">
                      ·
                    </span>
                    {c.href ? (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-white" aria-current="page">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary-sky md:text-sm">
            {eyebrow}
          </p>

          <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl [text-shadow:_0_2px_12px_rgba(0,0,0,0.45)]">
            {title}
          </h1>

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

          {description ? (
            <p
              className={cn(
                "max-w-2xl text-base leading-relaxed text-white/85 md:text-lg",
                align === "center" ? "mx-auto" : "",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

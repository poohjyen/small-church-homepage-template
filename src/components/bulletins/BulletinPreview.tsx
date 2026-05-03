"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function BulletinPreview({ src, alt, className }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "group relative block aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/5 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy"
        }
        aria-label={`${alt} 크게 보기`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 30vw, 240px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100">
          <Maximize2 className="size-3.5" aria-hidden />
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="주보 크게 보기"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute right-4 top-4 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="닫기"
          >
            <X className="size-6" aria-hidden />
          </button>
          <div
            className="relative h-[88vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

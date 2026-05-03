"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { id: string; url: string };

type Props = {
  photos: Photo[];
};

export function Lightbox({ photos }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy"
              aria-label={`사진 ${i + 1} 크게 보기`}
            >
              <Image
                src={p.url}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="사진 크게 보기"
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

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-8"
                aria-label="이전 사진"
              >
                <ChevronLeft className="size-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-8"
                aria-label="다음 사진"
              >
                <ChevronRight className="size-7" aria-hidden />
              </button>
            </>
          ) : null}

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[openIndex].url}
              alt=""
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {photos.length > 1 ? (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {openIndex + 1} / {photos.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

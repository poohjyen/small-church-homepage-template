"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalRouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-soft px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center ring-1 ring-black/5 sm:p-12">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-8" strokeWidth={1.5} aria-hidden />
        </div>

        <p className="mt-6 text-sm font-semibold tracking-wide text-red-600">
          ERROR
        </p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal sm:text-3xl">
          일시적인 오류가 발생했습니다
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-warm-gray">
          페이지를 표시하는 중 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주시거나 홈으로 돌아가 주세요.
        </p>

        {error.digest ? (
          <p className="mt-4 inline-block rounded-md bg-soft px-3 py-1 font-mono text-[11px] text-warm-gray">
            오류 코드: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-sky"
          >
            <RefreshCw className="size-4" aria-hidden />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-soft px-5 py-2.5 text-sm font-medium text-charcoal ring-1 ring-black/5 transition hover:bg-warm-gray/10"
          >
            <Home className="size-4" aria-hidden />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

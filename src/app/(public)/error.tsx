"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[(public)/error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-screen-md px-6 py-20">
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-black/5 sm:p-12">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-7" strokeWidth={1.5} aria-hidden />
        </div>
        <h1 className="mt-5 text-xl font-bold text-charcoal sm:text-2xl">
          페이지를 표시하는 중 문제가 발생했습니다
        </h1>
        <p className="mt-2 text-sm text-warm-gray">
          잠시 후 다시 시도해 주세요. 계속 발생하면 관리자에게 알려주세요.
        </p>
        {error.digest ? (
          <p className="mt-4 inline-block rounded-md bg-soft px-3 py-1 font-mono text-[11px] text-warm-gray">
            오류 코드: {error.digest}
          </p>
        ) : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
            className="inline-flex items-center justify-center rounded-lg bg-soft px-5 py-2.5 text-sm font-medium text-charcoal ring-1 ring-black/5 transition hover:bg-warm-gray/10"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

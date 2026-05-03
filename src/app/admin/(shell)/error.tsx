"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[admin/(shell)/error]", error);
  }, [error]);

  return (
    <div className="rounded-2xl bg-white p-8 ring-1 ring-black/5">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-6" strokeWidth={1.5} aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-bold text-charcoal">
          관리자 페이지를 불러오지 못했습니다
        </h2>
        <p className="mt-1 text-sm text-warm-gray">
          잠시 후 다시 시도해 주세요.
        </p>
        {error.digest ? (
          <p className="mt-3 inline-block rounded-md bg-soft px-3 py-1 font-mono text-[11px] text-warm-gray">
            오류 코드: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary-sky"
        >
          <RefreshCw className="size-4" aria-hidden />
          다시 시도
        </button>
      </div>
    </div>
  );
}

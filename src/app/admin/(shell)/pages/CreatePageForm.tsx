"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SLUG_RE, isHardcodedPageKey } from "@/lib/page-keys";

type Props = {
  existingSlugs: string[];
};

export function CreatePageForm({ existingSlugs }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      setError("슬러그를 입력해 주세요.");
      return;
    }
    if (!SLUG_RE.test(trimmed)) {
      setError("영문 소문자로 시작, 영문/숫자/하이픈 1~40자만 가능합니다.");
      return;
    }
    if (isHardcodedPageKey(trimmed)) {
      setError("예약된 슬러그입니다. 다른 이름을 선택해 주세요.");
      return;
    }
    if (existingSlugs.includes(trimmed)) {
      setError("이미 존재하는 페이지입니다. 아래 목록에서 편집해 주세요.");
      return;
    }
    setError(null);
    router.push(`/admin/pages/${trimmed}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label htmlFor="new-page-slug" className="mb-2 block text-sm font-semibold text-charcoal">
        새 페이지 만들기
      </label>
      <p className="mb-3 text-xs text-warm-gray">
        공개 URL은 <span className="font-mono">/pages/슬러그</span> 형식으로 생성됩니다. (예: <span className="font-mono">events-2026</span> → <span className="font-mono">/pages/events-2026</span>)
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus-within:border-primary-navy focus-within:ring-1 focus-within:ring-primary-navy/30">
          <span className="font-mono text-warm-gray">/pages/</span>
          <input
            id="new-page-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-page"
            className="ml-1 flex-1 border-0 bg-transparent font-mono text-charcoal outline-none placeholder:text-slate-400"
            autoComplete="off"
            spellCheck={false}
            maxLength={40}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-navy/90"
        >
          만들기 <ArrowRight className="size-4" />
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : null}
    </form>
  );
}

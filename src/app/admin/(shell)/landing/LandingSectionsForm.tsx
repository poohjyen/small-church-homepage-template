"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw, Save } from "lucide-react";
import {
  DEFAULT_LANDING_SECTIONS,
  LANDING_SECTION_LABELS,
  type LandingSectionConfig,
} from "@/lib/landing-sections";
import { saveLandingSections } from "./actions";

type Props = {
  initial: LandingSectionConfig[];
};

export function LandingSectionsForm({ initial }: Props) {
  const [items, setItems] = useState<LandingSectionConfig[]>(initial);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { type: "ok" | "err"; text: string } | null
  >(null);

  const dirty = JSON.stringify(items) !== JSON.stringify(initial);

  function move(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setItems(copy);
  }

  function toggleVisible(idx: number) {
    const copy = [...items];
    copy[idx] = { ...copy[idx], visible: !copy[idx].visible };
    setItems(copy);
  }

  function reset() {
    setItems(DEFAULT_LANDING_SECTIONS);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await saveLandingSections({ items });
      if (res.ok) {
        setMessage({ type: "ok", text: "저장했습니다." });
      } else {
        setMessage({ type: "err", text: res.error });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.map((s, idx) => {
          const label = LANDING_SECTION_LABELS[s.key];
          return (
            <li key={s.key} className="flex items-center gap-3 p-3">
              <span className="w-6 text-center font-mono text-xs text-warm-gray">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    s.visible
                      ? "truncate text-sm font-medium text-charcoal"
                      : "truncate text-sm font-medium text-slate-400 line-through"
                  }
                >
                  {label}
                </p>
                <p className="truncate font-mono text-[11px] text-warm-gray">
                  {s.key}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleVisible(idx)}
                className={
                  s.visible
                    ? "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-charcoal transition hover:border-secondary-sky"
                    : "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:border-secondary-sky"
                }
                title={s.visible ? "숨기기" : "보이기"}
              >
                {s.visible ? (
                  <>
                    <Eye className="size-3.5" /> 표시
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> 숨김
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="rounded-md border border-slate-200 p-1.5 text-warm-gray transition hover:border-secondary-sky hover:text-primary-navy disabled:cursor-not-allowed disabled:opacity-40"
                title="위로"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1}
                className="rounded-md border border-slate-200 p-1.5 text-warm-gray transition hover:border-secondary-sky hover:text-primary-navy disabled:cursor-not-allowed disabled:opacity-40"
                title="아래로"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={!dirty || pending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="size-4" />
          {pending ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-warm-gray transition hover:border-secondary-sky hover:text-primary-navy"
        >
          <RotateCcw className="size-4" />
          기본값 복원
        </button>
        {dirty ? (
          <span className="text-xs text-amber-600">저장하지 않은 변경사항</span>
        ) : null}
        {message ? (
          <span
            className={
              message.type === "ok"
                ? "text-xs text-emerald-600"
                : "text-xs text-red-600"
            }
          >
            {message.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}

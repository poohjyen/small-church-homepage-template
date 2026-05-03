import type { WorshipAccent, WorshipScheduleItem } from "@/types/database";

const ACCENT_BG: Record<WorshipAccent, string> = {
  navy: "bg-primary-navy",
  "navy-dark": "bg-primary-navy-dark",
  "navy-light": "bg-primary-navy-light",
  teal: "bg-secondary-sky",
  amber: "bg-accent-amber",
};

const ACCENT_BADGE: Record<WorshipAccent, string> = {
  navy: "text-primary-navy",
  "navy-dark": "text-primary-navy-dark",
  "navy-light": "text-primary-navy-light",
  teal: "text-secondary-sky",
  amber: "text-accent-amber",
};

export function WorshipSection({ items }: { items: WorshipScheduleItem[] }) {
  return (
    <section className="container mx-auto px-4 pb-10 md:pb-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-sky md:text-sm">
            Worship
          </p>
          <h2 className="mt-3 text-2xl font-bold text-charcoal md:text-3xl">
            주간 예배 일정
          </h2>
        </header>

        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {items.map((w, i) => (
            <li
              key={`${w.title}-${i}`}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 text-white shadow-sm ${ACCENT_BG[w.accent]}`}
            >
              <span
                className={`grid h-10 min-w-10 shrink-0 place-items-center rounded-full bg-white px-2 text-sm font-bold ${ACCENT_BADGE[w.accent]}`}
              >
                {w.day}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold md:text-lg">{w.title}</p>
                <p className="mt-1 text-sm text-white/90">
                  {w.time} · {w.place}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

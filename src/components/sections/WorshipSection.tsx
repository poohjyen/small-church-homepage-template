import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import type { WorshipAccent, WorshipScheduleItem } from "@/types/database";

/* 설정(worship_schedules) 미입력 시 기본 예배 일정 — 예배안내 페이지·홈 섹션 공용 */
export const FALLBACK_WORSHIP: WorshipScheduleItem[] = [
  { title: "주일오전 영광예배", day: "일", time: "11:00", place: "본당", accent: "navy" },
  { title: "주일오후 찬양예배", day: "일", time: "13:30", place: "본당", accent: "navy-dark" },
  { title: "수요 진리예배", day: "수", time: "19:30", place: "본당", accent: "navy-light" },
  { title: "금요 성령충만", day: "금", time: "20:30", place: "본당", accent: "teal" },
];

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

export function WorshipSection({
  items,
  reveal = false,
  className = "",
}: {
  items: WorshipScheduleItem[];
  reveal?: boolean;
  className?: string;
}) {
  const header = <SectionHeading eyebrow="WORSHIP" title="주간 예배 일정" />;

  const cardClass = (accent: WorshipAccent) =>
    `flex items-center gap-4 px-5 py-4 text-white shadow-sm ${ACCENT_BG[accent]}`;

  const cardInner = (w: WorshipScheduleItem) => (
    <>
      <span
        className={`grid h-10 min-w-10 shrink-0 place-items-center bg-white px-2 text-sm font-bold ${ACCENT_BADGE[w.accent]}`}
      >
        {w.day}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium md:text-lg">{w.title}</p>
        <p className="mt-1 text-sm text-white/90">
          {w.time} · {w.place}
        </p>
      </div>
    </>
  );

  return (
    <section className={`container mx-auto px-4 pb-10 md:pb-12 ${className}`}>
      <div className="mx-auto max-w-5xl">
        {reveal ? <FadeIn direction="down">{header}</FadeIn> : header}

        {reveal ? (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {items.map((w, i) => (
              <FadeIn
                key={`${w.title}-${i}`}
                delay={i * 70}
                className={cardClass(w.accent)}
              >
                {cardInner(w)}
              </FadeIn>
            ))}
          </div>
        ) : (
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {items.map((w, i) => (
              <li key={`${w.title}-${i}`} className={cardClass(w.accent)}>
                {cardInner(w)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

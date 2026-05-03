import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { WorshipSection } from "@/components/sections/WorshipSection";
import { getSiteSetting } from "@/lib/data/site";
import { getPageBlocks } from "@/lib/data/page-blocks";
import type { DawnPrayerItem, WorshipScheduleItem } from "@/types/database";

export const metadata = { title: "예배 안내" };

const FALLBACK_WORSHIP: WorshipScheduleItem[] = [
  { title: "주일오전 영광예배", day: "일", time: "11:00", place: "본당", accent: "navy" },
  { title: "주일오후 찬양예배", day: "일", time: "13:30", place: "본당", accent: "navy-dark" },
  { title: "수요 진리예배", day: "수", time: "19:30", place: "본당", accent: "navy-light" },
  { title: "금요 성령충만", day: "금", time: "20:30", place: "본당", accent: "teal" },
];

const FALLBACK_DAWN: DawnPrayerItem[] = [
  { day: "월", topic: "나라와 민족을 위하여" },
  { day: "화", topic: "가정과 자녀들을 위하여" },
  { day: "수", topic: "교회와 주의 종들을 위하여" },
  { day: "목", topic: "사명과 선교를 위하여" },
  { day: "금", topic: "일터와 건강을 위하여" },
  { day: "토", topic: "주일예배와 인도자들을 위하여" },
];

export default async function WorshipPage() {
  const [worship, dawn, blocks] = await Promise.all([
    getSiteSetting("worship_schedules"),
    getSiteSetting("dawn_prayers"),
    getPageBlocks("worship"),
  ]);
  const worshipItems = worship?.items?.length ? worship.items : FALLBACK_WORSHIP;
  const dawnItems = dawn?.items?.length ? dawn.items : FALLBACK_DAWN;

  return (
    <>
      <PageHero eyebrow="WORSHIP" title="예배 안내" />

      <div className="pt-12 md:pt-16">
        <WorshipSection items={worshipItems} />
      </div>

      <section className="container mx-auto px-4 pb-20 md:pb-24">
        <div className="mx-auto max-w-5xl rounded-2xl bg-primary-navy p-8 text-white shadow-lg md:p-12">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75 md:text-sm">
              Dawn Prayer
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              새벽 은혜기도회 — 요일별 기도제목
            </h2>
            <p className="mt-3 text-sm text-white/80 md:text-base">
              매일 오전 5시, 함께 깨어 기도합니다.
            </p>
          </header>

          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {dawnItems.map((p, i) => (
              <li
                key={`${p.day}-${i}`}
                className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-base font-bold text-primary-navy">
                  {p.day}
                </span>
                <span className="text-base md:text-lg">{p.topic}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-white/20 pt-5 text-center text-sm text-white/85 md:text-base">
            매일 — 아픈 성도들의 건강 회복과 위로를 위하여
          </p>
        </div>

        {blocks.length > 0 ? (
          <div className="mt-16 border-t border-slate-200 pt-12">
            <PageBlockContent blocks={blocks} />
          </div>
        ) : null}
      </section>
    </>
  );
}

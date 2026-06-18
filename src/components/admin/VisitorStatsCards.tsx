import { Eye, Monitor, Smartphone, ArrowUpRight } from "lucide-react";
import type { VisitorStats } from "@/lib/data/visitor-stats";

// 의존성 없는 막대그래프 (최근 N일 방문자/페이지뷰 추이)
function TrendChart({ daily }: { daily: VisitorStats["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));

  return (
    <div className="flex h-32 items-end gap-2">
      {daily.map((d) => {
        const viewsH = (d.views / max) * 100;
        const visitorsH = (d.visitors / max) * 100;
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative flex h-24 w-full items-end justify-center">
              {/* 페이지뷰 (연한 막대) */}
              <div
                className="absolute bottom-0 w-full rounded-t bg-secondary-sky/25"
                style={{ height: `${viewsH}%` }}
                title={`${d.label} 페이지뷰 ${d.views}`}
              />
              {/* 방문자 (진한 막대, 앞에) */}
              <div
                className="absolute bottom-0 w-1/2 rounded-t bg-primary-navy"
                style={{ height: `${visitorsH}%` }}
                title={`${d.label} 방문자 ${d.visitors}`}
              />
            </div>
            <span className="text-[10px] leading-none text-warm-gray">
              {d.label}
            </span>
            <span className="text-[10px] font-medium leading-none text-charcoal">
              {d.visitors}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DeviceBar({ devices }: { devices: VisitorStats["devices"] }) {
  const pcM = devices.pc;
  const mob = devices.mobile + devices.tablet;
  const total = pcM + mob;
  if (total === 0) {
    return <p className="text-sm text-warm-gray">아직 데이터가 없어요.</p>;
  }
  const pcPct = Math.round((pcM / total) * 100);
  const mobPct = 100 - pcPct;
  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-soft">
        <div className="bg-primary-navy" style={{ width: `${pcPct}%` }} />
        <div className="bg-accent-coral" style={{ width: `${mobPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-charcoal">
          <Monitor className="size-4 text-primary-navy" aria-hidden />
          PC <span className="font-semibold">{pcPct}%</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-charcoal">
          <Smartphone className="size-4 text-accent-coral" aria-hidden />
          모바일 <span className="font-semibold">{mobPct}%</span>
        </span>
      </div>
    </div>
  );
}

export function VisitorStatsCards({ stats }: { stats: VisitorStats }) {
  return (
    <section aria-labelledby="visitor-stats-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="visitor-stats-heading"
          className="text-base font-bold text-charcoal"
        >
          방문자 통계
        </h2>
        <span className="text-xs text-warm-gray">최근 7일 · 한국시간 기준</span>
      </div>

      {!stats.hasData ? (
        <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-black/5">
          <p className="text-sm text-warm-gray">
            아직 방문 기록이 쌓이지 않았어요. 사이트에 방문이 생기면 여기에
            표시됩니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* 추이 그래프 + 요약 */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-xs text-warm-gray">오늘 방문자</p>
                <p className="text-2xl font-bold text-charcoal">
                  {stats.today.visitors.toLocaleString()}
                  <span className="ml-1 text-sm font-medium text-warm-gray">
                    명
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-warm-gray">어제</p>
                <p className="text-lg font-semibold text-charcoal">
                  {stats.yesterday.visitors.toLocaleString()}명
                </p>
              </div>
              <div>
                <p className="text-xs text-warm-gray">최근 7일</p>
                <p className="text-lg font-semibold text-charcoal">
                  {stats.last7.visitors.toLocaleString()}명
                  <span className="ml-1 text-xs font-normal text-warm-gray">
                    / {stats.last7.views.toLocaleString()} 페이지뷰
                  </span>
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-warm-gray">
                <span className="inline-flex items-center gap-1">
                  <span className="size-2.5 rounded-sm bg-primary-navy" />
                  방문자
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-2.5 rounded-sm bg-secondary-sky/40" />
                  페이지뷰
                </span>
              </div>
            </div>
            <TrendChart daily={stats.daily} />
          </div>

          {/* 기기 비율 */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <h3 className="mb-4 text-sm font-semibold text-charcoal">
              PC vs 모바일
            </h3>
            <DeviceBar devices={stats.devices} />
          </div>

          {/* 많이 본 페이지 */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
              <Eye className="size-4 text-primary-navy" aria-hidden />
              많이 본 페이지
            </h3>
            <ul className="space-y-2">
              {stats.topPages.length === 0 ? (
                <li className="text-sm text-warm-gray">데이터 없음</li>
              ) : (
                stats.topPages.map((p) => (
                  <li
                    key={p.path}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-charcoal">
                      {p.label}
                    </span>
                    <span className="shrink-0 font-semibold text-charcoal">
                      {p.views.toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 유입 경로 */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 lg:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
              <ArrowUpRight className="size-4 text-primary-navy" aria-hidden />
              유입 경로
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {stats.topReferrers.length === 0 ? (
                <li className="text-sm text-warm-gray">
                  직접 방문이거나 아직 외부 유입 기록이 없어요.
                </li>
              ) : (
                stats.topReferrers.map((r) => (
                  <li
                    key={r.host}
                    className="flex items-center justify-between gap-2 rounded-lg bg-soft px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-charcoal">
                      {r.label}
                    </span>
                    <span className="shrink-0 font-semibold text-charcoal">
                      {r.count.toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

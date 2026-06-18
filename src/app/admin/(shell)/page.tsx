import Link from "next/link";
import {
  UserPlus,
  HandHeart,
  Home as HomeIcon,
  ArrowRight,
  Megaphone,
  FileText,
  Mic,
  Pen,
  AlertTriangle,
  Image as ImageIcon,
  FolderOpen,
  TrendingUp,
  ReceiptText,
} from "lucide-react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getRecentNotices } from "@/lib/data/notices";
import { getLatestBulletin } from "@/lib/data/bulletins";
import { getRecentSermons } from "@/lib/data/sermons";
import { getColumns } from "@/lib/data/columns";
import { countNewSubmissions } from "@/lib/data/forms";
import { getSiteSetting } from "@/lib/data/site";
import { getContentStats } from "@/lib/data/admin-stats";
import { CHURCH } from "../../../../church.config";

export const metadata = { title: "대시보드" };

type SubmissionCard = {
  href: string;
  label: string;
  count: number;
  Icon: typeof UserPlus;
};

const WEEKLY_TASKS = [
  "주일주보 업로드",
  "주일설교 등록",
  "목양칼럼 등록",
];

type RecentRow = {
  href: string;
  label: string;
  Icon: typeof UserPlus;
  lastDate: string | null;
  lastTitle: string | null;
};

function staleness(lastDate: string | null) {
  if (!lastDate) return { tone: "muted" as const, days: null, label: "등록 기록 없음" };
  const days = differenceInCalendarDays(new Date(), parseISO(lastDate));
  if (days >= 14) return { tone: "danger" as const, days, label: `${days}일 전` };
  if (days >= 7) return { tone: "warn" as const, days, label: `${days}일 전` };
  return { tone: "ok" as const, days, label: `${days}일 전` };
}

export default async function AdminDashboardPage() {
  const [notices, bulletin, sermons, columns, counts, adminNameSetting, stats] =
    await Promise.all([
      getRecentNotices(1),
      getLatestBulletin(),
      getRecentSermons(1),
      getColumns({ page: 1, perPage: 1 }),
      countNewSubmissions(),
      getSiteSetting("admin_name"),
      getContentStats(),
    ]);
  const adminName =
    (typeof adminNameSetting === "string" && adminNameSetting.trim()) ||
    CHURCH.pastorName.replace(/\s*목사\s*$/, "");

  const submissionCards: SubmissionCard[] = [
    {
      href: "/admin/forms/newcomer",
      label: "새가족",
      count: counts.newcomer,
      Icon: UserPlus,
    },
    {
      href: "/admin/forms/prayer",
      label: "기도제목",
      count: counts.prayer,
      Icon: HandHeart,
    },
    {
      href: "/admin/forms/visit",
      label: "심방 요청",
      count: counts.visit,
      Icon: HomeIcon,
    },
    {
      href: "/admin/forms/donation-receipt",
      label: "기부금 영수증",
      count: counts.donation,
      Icon: ReceiptText,
    },
  ];

  const recentRows: RecentRow[] = [
    {
      href: "/admin/notices",
      label: "교회소식·교회일정",
      Icon: Megaphone,
      lastDate: notices[0]?.created_at ?? null,
      lastTitle: notices[0]?.title ?? null,
    },
    {
      href: "/admin/bulletins",
      label: "주보",
      Icon: FileText,
      lastDate: bulletin?.created_at ?? null,
      lastTitle: bulletin?.title ?? null,
    },
    {
      href: "/admin/sermons",
      label: "주일설교",
      Icon: Mic,
      lastDate: sermons[0]?.created_at ?? null,
      lastTitle: sermons[0]?.title ?? null,
    },
    {
      href: "/admin/columns",
      label: "목양칼럼",
      Icon: Pen,
      lastDate: columns.data[0]?.created_at ?? null,
      lastTitle: columns.data[0]?.title ?? null,
    },
  ];

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-warm-gray">{today}</p>
        <h1 className="mt-1 text-2xl font-bold text-charcoal md:text-3xl">
          안녕하세요, {adminName} 목사님 <span aria-hidden>👋</span>
        </h1>
        <p className="mt-2 text-sm text-warm-gray">
          오늘도 한 영혼을 향한 사역에 동행합니다.
        </p>
      </header>

      <section aria-labelledby="submissions-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="submissions-heading"
            className="text-base font-bold text-charcoal"
          >
            새 신청 알림
          </h2>
          <Link
            href="/admin/forms/newcomer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-navy hover:text-secondary-sky"
          >
            신청 내역 전체보기
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {submissionCards.map(({ href, label, count, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl bg-white p-5 ring-1 ring-black/5 transition hover:ring-primary-navy/30"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-primary-navy/8 p-2 text-primary-navy">
                  <Icon className="size-5" aria-hidden />
                </span>
                {count > 0 ? (
                  <span className="rounded-full bg-accent-coral/15 px-2 py-0.5 text-xs font-semibold text-accent-coral">
                    NEW
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm text-warm-gray">{label}</p>
              <p className="mt-1 text-3xl font-bold text-charcoal">
                {count}
                <span className="ml-1 text-base font-medium text-warm-gray">
                  건
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="stats-heading"
            className="text-base font-bold text-charcoal"
          >
            콘텐츠 현황
          </h2>
          <span className="text-xs text-warm-gray">최근 30일 신규 표시</span>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              href: "/admin/notices",
              label: "교회소식·교회일정",
              total: stats.notices.total,
              recent: stats.notices.recent,
              Icon: Megaphone,
            },
            {
              href: "/admin/bulletins",
              label: "주보",
              total: stats.bulletins.total,
              recent: stats.bulletins.recent,
              Icon: FileText,
            },
            {
              href: "/admin/sermons",
              label: "주일설교",
              total: stats.sermons.total,
              recent: stats.sermons.recent,
              Icon: Mic,
            },
            {
              href: "/admin/gallery",
              label: "갤러리",
              total: stats.galleries.total,
              recent: stats.galleries.recent,
              Icon: ImageIcon,
            },
            {
              href: "/admin/resources",
              label: "자료실",
              total: stats.resources.total,
              recent: stats.resources.recent,
              Icon: FolderOpen,
            },
          ].map(({ href, label, total, recent, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:ring-primary-navy/30"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-primary-navy/8 p-1.5 text-primary-navy">
                  <Icon className="size-4" aria-hidden />
                </span>
                {recent > 0 ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <TrendingUp className="size-3" aria-hidden />
                    +{recent}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 line-clamp-1 text-xs text-warm-gray">{label}</p>
              <p className="mt-0.5 text-2xl font-bold text-charcoal">
                {total.toLocaleString()}
                <span className="ml-1 text-sm font-medium text-warm-gray">건</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-base font-bold text-charcoal">이번 주 할 일</h2>
          <p className="mt-1 text-sm text-warm-gray">
            매주 챙기는 기본 콘텐츠 등록 항목입니다.
          </p>
          <ul className="mt-4 space-y-2">
            {WEEKLY_TASKS.map((task) => (
              <li
                key={task}
                className="flex items-center gap-3 rounded-lg border border-black/5 bg-soft px-4 py-3"
              >
                <span
                  aria-hidden
                  className="size-4 shrink-0 rounded border border-warm-gray/40"
                />
                <span className="text-sm text-charcoal">{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-base font-bold text-charcoal">
            최근 등록 콘텐츠
          </h2>
          <p className="mt-1 text-sm text-warm-gray">
            7일 이상 비어있으면 노란색, 14일 이상이면 빨간색으로 표시됩니다.
          </p>
          <ul className="mt-4 divide-y divide-black/5">
            {recentRows.map((row) => {
              const { tone, label } = staleness(row.lastDate);
              return (
                <li key={row.href} className="py-3">
                  <Link
                    href={row.href}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1 hover:bg-soft"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <row.Icon
                        className="size-4 shrink-0 text-warm-gray"
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-charcoal">
                          {row.label}
                        </span>
                        <span className="block truncate text-xs text-warm-gray">
                          {row.lastTitle ?? "—"}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                        tone === "ok" && "bg-emerald-100 text-emerald-700",
                        tone === "warn" && "bg-amber-100 text-amber-700",
                        tone === "danger" && "bg-red-100 text-red-700",
                        tone === "muted" && "bg-soft text-warm-gray"
                      )}
                    >
                      {(tone === "warn" || tone === "danger") && (
                        <AlertTriangle className="size-3" aria-hidden />
                      )}
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

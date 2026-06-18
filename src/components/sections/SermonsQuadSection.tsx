import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, FileText, PlayCircle, Newspaper } from "lucide-react";
import { format } from "date-fns";

import { FadeIn } from "@/components/ui/fade-in";
import type {
  Bulletin,
  Notice,
  PastoralColumn,
  Sermon,
} from "@/types/database";

import { SectionContainer } from "./SectionContainer";

type CardItem = {
  href: string;
  title: string;
  date: string;
  meta?: string;
};

function CategoryCard({
  icon,
  eyebrow,
  title,
  allHref,
  items,
  visibility,
  index = 0,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  allHref: string;
  items: CardItem[];
  visibility?: string;
  index?: number;
}) {
  const top = items.slice(0, 3);
  return (
    <FadeIn delay={index * 80} className={`h-full ${visibility ?? ""}`}>
    <article className="h-full border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-secondary-sky/30 md:p-4">
      <header className="border-b border-slate-300 pb-2">
        <Link
          href={allHref}
          aria-label={`${title} 전체보기`}
          className="group flex items-center gap-2"
        >
          {icon}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              {eyebrow}
            </p>
            <h3 className="mt-0.5 text-base font-bold text-primary-navy transition group-hover:text-secondary-sky md:text-lg">
              {title}
            </h3>
          </div>
        </Link>
      </header>

      <ul className="mt-0.5 divide-y divide-slate-100 md:hidden">
        {top.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="line-clamp-1 min-w-0 flex-1 text-[14px] font-normal text-charcoal">
                {it.title}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-warm-gray">
                {it.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-1.5 hidden divide-y divide-slate-100 md:block">
        {top.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group flex items-center justify-between gap-3 py-1.5 transition hover:text-secondary-sky"
            >
              <span className="line-clamp-1 min-w-0 flex-1 text-sm font-medium text-charcoal transition group-hover:text-secondary-sky">
                {it.title}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-warm-gray">
                {it.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
    </FadeIn>
  );
}

type Props = {
  sermons: Sermon[];
  columns: PastoralColumn[];
  notices: Notice[];
  bulletins: Bulletin[];
};

export function SermonsQuadSection({
  sermons,
  columns,
  notices,
  bulletins,
}: Props) {
  const ICON_CLASS = "size-6 text-secondary-sky";
  return (
    <SectionContainer bg="soft">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4 lg:grid-cols-3 lg:gap-4">
        <CategoryCard
          index={0}
          visibility="hidden lg:block"
          icon={<PlayCircle className={ICON_CLASS} strokeWidth={1.5} aria-hidden />}
          eyebrow="SERMON"
          title="주일설교"
          allHref="/sermons"
          items={sermons.map((s) => ({
            href: `/sermons/${s.id}`,
            title: s.title,
            date: format(new Date(s.sermon_date), "yyyy.MM.dd"),
            meta: s.scripture ?? undefined,
          }))}
        />
        <CategoryCard
          index={1}
          icon={<FileText className={ICON_CLASS} strokeWidth={1.5} aria-hidden />}
          eyebrow="COLUMN"
          title="목양칼럼"
          allHref="/columns"
          items={columns.map((c) => ({
            href: `/columns/${c.id}`,
            title: c.title,
            date: format(new Date(c.published_date), "yyyy.MM.dd"),
            meta: c.author,
          }))}
        />
        <CategoryCard
          index={2}
          icon={<Bell className={ICON_CLASS} strokeWidth={1.5} aria-hidden />}
          eyebrow="CHURCH NEWS"
          title="교회소식"
          allHref="/notices"
          items={notices.map((n) => ({
            href: `/notices/${n.id}`,
            title: n.title,
            date: format(new Date(n.created_at), "yyyy.MM.dd"),
          }))}
        />
        <CategoryCard
          index={3}
          visibility="lg:hidden"
          icon={<Newspaper className={ICON_CLASS} strokeWidth={1.5} aria-hidden />}
          eyebrow="BULLETIN"
          title="주보"
          allHref="/bulletins"
          items={bulletins.map((b) => ({
            href: `/bulletins/${b.id}`,
            title: b.title,
            date: format(new Date(b.bulletin_date), "yyyy.MM.dd"),
          }))}
        />
      </div>
    </SectionContainer>
  );
}

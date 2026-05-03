import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { format } from "date-fns";
import { getNoticeById, getAdjacentNotice } from "@/lib/data/notices";
import { PostNav } from "@/components/board/PostNav";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { absoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  return { title: notice?.title ?? "공지사항" };
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) notFound();

  const { prev, next } = await getAdjacentNotice(
    notice.id,
    notice.category,
    notice.created_at,
  );
  const isSchedule = notice.category === "schedule";
  const listHref = isSchedule ? "/schedules" : "/notices";
  const listLabel = isSchedule ? "교회일정 목록" : "교회소식 목록";

  return (
    <article className="container mx-auto px-4 py-16 md:py-24">
      <ArticleJsonLd
        title={notice.title}
        description={notice.content.slice(0, 160)}
        datePublished={notice.created_at}
        url={absoluteUrl(`/notices/${notice.id}`)}
      />
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-slate-200 pb-8">
          {notice.is_pinned ? (
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent-coral/15 px-3 py-1 text-xs font-semibold text-accent-coral">
              <Pin className="size-3" aria-hidden /> 고정글
            </p>
          ) : null}
          <h1 className="text-2xl font-bold text-primary-navy md:text-3xl">
            {notice.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-warm-gray">
            <time dateTime={notice.created_at}>
              {format(new Date(notice.created_at), "yyyy년 MM월 dd일")}
            </time>
            <span>조회 {notice.view_count.toLocaleString()}</span>
          </div>
        </header>

        <div className="prose prose-slate mt-10 max-w-none whitespace-pre-wrap text-base leading-loose text-charcoal md:text-lg">
          {notice.content}
        </div>

        <PostNav
          prev={prev ? { href: `/notices/${prev.id}`, title: prev.title } : null}
          next={next ? { href: `/notices/${next.id}`, title: next.title } : null}
          listHref={listHref}
          listLabel={listLabel}
        />
      </div>
    </article>
  );
}

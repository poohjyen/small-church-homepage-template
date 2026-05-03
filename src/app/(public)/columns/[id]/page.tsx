import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getColumnById, getAdjacentColumn } from "@/lib/data/columns";
import { PostNav } from "@/components/board/PostNav";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { absoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const column = await getColumnById(id);
  return { title: column?.title ?? "목양칼럼" };
}

export default async function ColumnDetailPage({ params }: Props) {
  const { id } = await params;
  const column = await getColumnById(id);
  if (!column) notFound();

  const { prev, next } = await getAdjacentColumn(
    column.published_date,
    column.id,
  );

  return (
    <article className="container mx-auto px-4 py-16 md:py-24">
      <ArticleJsonLd
        title={column.title}
        description={column.content.slice(0, 160)}
        author={column.author}
        datePublished={column.published_date}
        url={absoluteUrl(`/columns/${column.id}`)}
      />
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-slate-200 pb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
            PASTORAL COLUMN
          </p>
          <h1 className="mt-3 text-2xl font-bold text-primary-navy md:text-4xl">
            {column.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-warm-gray">
            <span>{column.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={column.published_date}>
              {format(new Date(column.published_date), "yyyy년 MM월 dd일")}
            </time>
          </div>
        </header>

        <div className="prose prose-slate mt-10 max-w-none whitespace-pre-wrap text-base leading-loose text-charcoal md:text-lg">
          {column.content}
        </div>

        <PostNav
          prev={prev ? { href: `/columns/${prev.id}`, title: prev.title } : null}
          next={next ? { href: `/columns/${next.id}`, title: next.title } : null}
          listHref="/columns"
          listLabel="칼럼 목록"
        />
      </div>
    </article>
  );
}

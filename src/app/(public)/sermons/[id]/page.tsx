import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getSermonById, getAdjacentSermon } from "@/lib/data/sermons";
import { PostNav } from "@/components/board/PostNav";
import { VideoJsonLd } from "@/components/seo/video-json-ld";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const sermon = await getSermonById(id);
  return { title: sermon?.title ?? "주일설교" };
}

export default async function SermonDetailPage({ params }: Props) {
  const { id } = await params;
  const sermon = await getSermonById(id);
  if (!sermon) notFound();

  const { prev, next } = await getAdjacentSermon(sermon.sermon_date, sermon.id);

  return (
    <article className="container mx-auto px-4 py-16 md:py-24">
      <VideoJsonLd
        title={sermon.title}
        description={sermon.summary ?? sermon.scripture ?? sermon.title}
        uploadDate={sermon.sermon_date}
        youtubeId={sermon.youtube_id}
      />
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          {sermon.scripture ? (
            <p className="text-sm font-semibold tracking-[0.3em] text-secondary-sky">
              {sermon.scripture}
            </p>
          ) : null}
          <h1 className="mt-3 text-3xl font-bold text-primary-navy md:text-5xl">
            {sermon.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-warm-gray md:text-base">
            <span>{sermon.preacher}</span>
            <span aria-hidden>·</span>
            <time dateTime={sermon.sermon_date}>
              {format(new Date(sermon.sermon_date), "yyyy년 MM월 dd일")}
            </time>
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-black/5">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube.com/embed/${sermon.youtube_id}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {sermon.summary ? (
          <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-soft p-8 text-base leading-loose text-charcoal ring-1 ring-black/5 md:p-10 md:text-lg">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-warm-gray">
              설교 요약
            </h2>
            <p className="mt-4 whitespace-pre-wrap">{sermon.summary}</p>
          </section>
        ) : null}

        <PostNav
          prev={prev ? { href: `/sermons/${prev.id}`, title: prev.title } : null}
          next={next ? { href: `/sermons/${next.id}`, title: next.title } : null}
          listHref="/sermons"
          listLabel="설교 목록"
        />
      </div>
    </article>
  );
}

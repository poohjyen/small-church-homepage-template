import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getVideoById, getAdjacentVideo } from "@/lib/data/videos";
import { PostNav } from "@/components/board/PostNav";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const video = await getVideoById(id);
  return { title: video?.title ?? "특별영상" };
}

export default async function VideoDetailPage({ params }: Props) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();

  const { prev, next } = await getAdjacentVideo(video.video_date, video.id);

  return (
    <article className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary-navy md:text-5xl">
            {video.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-warm-gray md:text-base">
            {video.performer ? <span>{video.performer}</span> : null}
            {video.performer ? <span aria-hidden>·</span> : null}
            <time dateTime={video.video_date}>
              {format(new Date(video.video_date), "yyyy년 MM월 dd일")}
            </time>
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-black/5">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube.com/embed/${video.youtube_id}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {video.description ? (
          <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-soft p-8 text-base leading-loose text-charcoal ring-1 ring-black/5 md:p-10 md:text-lg">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-warm-gray">
              영상 설명
            </h2>
            <p className="mt-4 whitespace-pre-wrap">{video.description}</p>
          </section>
        ) : null}

        <PostNav
          prev={prev ? { href: `/videos/${prev.id}`, title: prev.title } : null}
          next={next ? { href: `/videos/${next.id}`, title: next.title } : null}
          listHref="/videos"
          listLabel="특별영상 목록"
        />
      </div>
    </article>
  );
}

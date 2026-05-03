import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  getGalleryById,
  getGalleryImages,
  getAdjacentGallery,
} from "@/lib/data/galleries";
import { Lightbox } from "@/components/gallery/Lightbox";
import { PostNav } from "@/components/board/PostNav";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const gallery = await getGalleryById(id);
  return { title: gallery?.title ?? "갤러리" };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const [gallery, images] = await Promise.all([
    getGalleryById(id),
    getGalleryImages(id),
  ]);
  if (!gallery) notFound();

  const { prev, next } = await getAdjacentGallery(
    gallery.id,
    gallery.event_date,
    gallery.created_at,
  );

  return (
    <article className="container mx-auto px-4 py-16 md:py-24">
      <header className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
          {gallery.category}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-primary-navy md:text-4xl">
          {gallery.title}
        </h1>
        {gallery.event_date ? (
          <time
            className="mt-3 block text-sm text-warm-gray md:text-base"
            dateTime={gallery.event_date}
          >
            {format(new Date(gallery.event_date), "yyyy년 MM월 dd일")}
          </time>
        ) : null}
      </header>

      <div className="mx-auto max-w-6xl">
        <Lightbox
          photos={images.map((img) => ({ id: img.id, url: img.image_url }))}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <PostNav
          prev={prev ? { href: `/gallery/${prev.id}`, title: prev.title } : null}
          next={next ? { href: `/gallery/${next.id}`, title: next.title } : null}
          listHref="/gallery"
          listLabel="갤러리 목록"
        />
      </div>
    </article>
  );
}

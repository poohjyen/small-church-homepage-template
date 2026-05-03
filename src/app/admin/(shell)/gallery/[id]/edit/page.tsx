import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getGalleryById, getGalleryImages } from "@/lib/data/galleries";
import { GalleryForm } from "../../GalleryForm";
import { SetCoverButton } from "../../SetCoverButton";

export const metadata = { title: "앨범 수정" };

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [gallery, images] = await Promise.all([
    getGalleryById(id),
    getGalleryImages(id),
  ]);
  if (!gallery) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminPageHeader title="앨범 수정" backHref="/admin/gallery" />

      <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <GalleryForm initial={gallery} />
      </section>

      <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <h2 className="text-base font-bold text-charcoal">
          업로드된 사진 ({images.length}장)
        </h2>
        <p className="mt-1 text-sm text-warm-gray">
          ⭐ 표시한 사진이 대표(목록 표지)가 됩니다. 다른 사진을 클릭해서 변경할 수 있어요.
        </p>
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img) => {
            const isCover = gallery.cover_image === img.image_url;
            return (
              <li
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-md ring-1 ring-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt=""
                  className="size-full object-cover"
                />
                <SetCoverButton
                  galleryId={gallery.id}
                  imageUrl={img.image_url}
                  isCover={isCover}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

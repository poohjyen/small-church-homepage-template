import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GalleryForm } from "../GalleryForm";

export const metadata = { title: "새 앨범" };

export default function NewGalleryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="새 앨범 만들기" backHref="/admin/gallery" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <GalleryForm />
      </div>
    </div>
  );
}

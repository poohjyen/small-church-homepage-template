import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getVideoById } from "@/lib/data/videos";
import { VideoForm } from "../../VideoForm";

export const metadata = { title: "특별영상 수정" };

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="특별영상 수정" backHref="/admin/videos" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <VideoForm initial={video} />
      </div>
    </div>
  );
}

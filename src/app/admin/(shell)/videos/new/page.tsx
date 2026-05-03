import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { VideoForm } from "../VideoForm";

export const metadata = { title: "새 특별영상" };

export default function NewVideoPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="새 특별영상 등록" backHref="/admin/videos" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <VideoForm />
      </div>
    </div>
  );
}

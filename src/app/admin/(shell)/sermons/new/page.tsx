import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SermonForm } from "../SermonForm";

export const metadata = { title: "새 주일설교" };

export default function NewSermonPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="새 주일설교 등록" backHref="/admin/sermons" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <SermonForm />
      </div>
    </div>
  );
}

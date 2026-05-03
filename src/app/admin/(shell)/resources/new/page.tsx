import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ResourceForm } from "../ResourceForm";

export const metadata = { title: "새 자료 업로드" };

export default function NewResourcePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="새 자료 업로드" backHref="/admin/resources" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <ResourceForm />
      </div>
    </div>
  );
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ColumnForm } from "../ColumnForm";

export const metadata = { title: "새 목양칼럼" };

export default function NewColumnPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="새 목양칼럼" backHref="/admin/columns" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <ColumnForm />
      </div>
    </div>
  );
}

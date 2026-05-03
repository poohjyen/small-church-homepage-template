import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getResourceById } from "@/lib/data/resources";
import { ResourceForm } from "../../ResourceForm";

export const metadata = { title: "자료 수정" };

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getResourceById(id);
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="자료 수정" backHref="/admin/resources" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <ResourceForm initial={resource} />
      </div>
    </div>
  );
}

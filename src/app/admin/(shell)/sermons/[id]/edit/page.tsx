import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSermonById } from "@/lib/data/sermons";
import { SermonForm } from "../../SermonForm";

export const metadata = { title: "주일설교 수정" };

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = await getSermonById(id);
  if (!sermon) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="주일설교 수정" backHref="/admin/sermons" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <SermonForm initial={sermon} />
      </div>
    </div>
  );
}

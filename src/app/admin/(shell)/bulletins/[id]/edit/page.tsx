import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getBulletins } from "@/lib/data/bulletins";
import { BulletinForm } from "../../BulletinForm";

export const metadata = { title: "주보 수정" };

export default async function EditBulletinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getBulletins({ page: 1, perPage: 100 });
  const bulletin = data.find((b) => b.id === id);
  if (!bulletin) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="주보 수정" backHref="/admin/bulletins" />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <BulletinForm initial={bulletin} />
      </div>
    </div>
  );
}

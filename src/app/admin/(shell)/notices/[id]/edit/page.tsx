import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getNoticeById } from "@/lib/data/notices";
import { NoticeForm } from "../../NoticeForm";

export const metadata = { title: "글 수정" };

export default async function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = await getNoticeById(id, { publishedOnly: false });
  if (!notice) notFound();

  const isSchedule = notice.category === "schedule";
  const backHref = isSchedule ? "/admin/schedules" : "/admin/notices";
  const title = isSchedule ? "교회일정 수정" : "교회소식 수정";

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title={title} backHref={backHref} />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <NoticeForm initial={notice} />
      </div>
    </div>
  );
}

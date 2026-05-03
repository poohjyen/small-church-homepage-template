import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticeForm } from "../NoticeForm";

export const metadata = { title: "새 글 작성" };

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewNoticePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const isSchedule = category === "schedule";
  const defaultCategory = isSchedule ? "schedule" : "news";
  const backHref = isSchedule ? "/admin/schedules" : "/admin/notices";
  const title = isSchedule ? "새 교회일정 작성" : "새 교회소식 작성";

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title={title} backHref={backHref} />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <NoticeForm defaultCategory={defaultCategory} />
      </div>
    </div>
  );
}

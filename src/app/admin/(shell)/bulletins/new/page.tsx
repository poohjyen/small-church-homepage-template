import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BulletinForm } from "../BulletinForm";

export const metadata = { title: "새 주보 등록" };

export default function NewBulletinPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="새 주보 등록"
        description="주보 PDF를 올리면서 같은 날짜의 목양칼럼도 한 번에 발행할 수 있습니다."
        backHref="/admin/bulletins"
      />
      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <BulletinForm />
      </div>
    </div>
  );
}

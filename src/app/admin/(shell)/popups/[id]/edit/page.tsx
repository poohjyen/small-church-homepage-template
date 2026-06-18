import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getPopupById } from "@/lib/data/popups";
import { PopupForm } from "../../PopupForm";

export const metadata = { title: "팝업 수정" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPopupPage({ params }: Props) {
  const { id } = await params;
  const popup = await getPopupById(id);
  if (!popup) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title={`팝업 수정 — ${popup.title}`}
        description="이미지 교체는 새 파일을 선택하면 자동으로 이전 이미지가 정리됩니다."
        backHref="/admin/popups"
      />
      <PopupForm initial={popup} />
    </div>
  );
}

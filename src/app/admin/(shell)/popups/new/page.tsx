import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PopupForm } from "../PopupForm";

export const metadata = { title: "새 팝업 만들기" };

export default function NewPopupPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="새 팝업 만들기"
        description="공개 페이지에 노출될 이미지 팝업을 등록합니다. 시작/종료 시각이 되면 자동으로 노출/내림됩니다."
        backHref="/admin/popups"
      />
      <PopupForm />
    </div>
  );
}

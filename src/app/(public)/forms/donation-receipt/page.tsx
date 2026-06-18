import { FormShell } from "@/components/forms/FormShell";
import { DonationReceiptForm } from "./DonationReceiptForm";

export const metadata = { title: "기부금 영수증 신청" };

export default function DonationReceiptPage() {
  return (
    <FormShell
      eyebrow="DONATION RECEIPT"
      title="기부금 영수증 신청"
      description="연말정산을 위해 원하시는 분에 한하여 기부금 영수증을 발급해 드립니다."
    >
      <DonationReceiptForm />
    </FormShell>
  );
}

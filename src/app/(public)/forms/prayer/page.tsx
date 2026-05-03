import { FormShell } from "@/components/forms/FormShell";
import { PrayerForm } from "./PrayerForm";

export const metadata = { title: "기도제목" };

export default function PrayerPage() {
  return (
    <FormShell eyebrow="PRAYER" title="기도제목">
      <PrayerForm />
    </FormShell>
  );
}

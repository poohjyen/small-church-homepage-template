import { FormShell } from "@/components/forms/FormShell";
import { VisitForm } from "./VisitForm";

export const metadata = { title: "심방 요청" };

export default function VisitPage() {
  return (
    <FormShell eyebrow="VISIT" title="심방 요청">
      <VisitForm />
    </FormShell>
  );
}

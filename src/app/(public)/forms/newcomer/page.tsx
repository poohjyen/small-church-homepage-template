import { FormShell } from "@/components/forms/FormShell";
import { NewcomerForm } from "./NewcomerForm";

export const metadata = { title: "새가족 등록" };

export default function NewcomerPage() {
  return (
    <FormShell eyebrow="NEWCOMER" title="새가족 등록">
      <NewcomerForm />
    </FormShell>
  );
}

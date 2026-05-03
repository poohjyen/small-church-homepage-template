import type { ReactNode } from "react";

import { PageHeader } from "@/components/board/PageHeader";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormShell({ eyebrow, title, description, children }: Props) {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-10">
        {children}
      </div>
    </div>
  );
}

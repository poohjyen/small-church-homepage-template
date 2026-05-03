import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  backHref,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-primary-navy"
          >
            <ChevronLeft className="size-4" aria-hidden />
            목록으로
          </Link>
        ) : null}
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-warm-gray">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

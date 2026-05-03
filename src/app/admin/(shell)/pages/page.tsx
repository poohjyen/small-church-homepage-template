import Link from "next/link";
import { ExternalLink, Pencil, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getCustomPageSummaries } from "@/lib/data/page-blocks";
import { deleteCustomPage } from "@/lib/actions/page-blocks";
import {
  customPageAdminHref,
  customPagePublicHref,
} from "@/lib/page-keys";
import { CreatePageForm } from "./CreatePageForm";

export const metadata = { title: "사용자 페이지" };

export default async function AdminCustomPagesPage() {
  const summaries = await getCustomPageSummaries();
  const existing = summaries.map((s) => s.page_key);

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="사용자 페이지"
        description="원하는 슬러그로 새 공개 페이지를 만들고 블록(제목·본문·이미지·인용·동영상)으로 자유롭게 구성할 수 있어요. 만들어진 페이지는 /pages/슬러그 URL로 공개됩니다."
      />

      <CreatePageForm existingSlugs={existing} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-warm-gray">
          기존 사용자 페이지 ({summaries.length})
        </h2>

        {summaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-warm-gray">
            아직 만들어진 사용자 페이지가 없습니다.
            <br />위 입력란에 슬러그를 입력해 새 페이지를 만들어 보세요.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {summaries.map((s) => (
              <li
                key={s.page_key}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary-navy" aria-hidden />
                    <Link
                      href={customPageAdminHref(s.page_key)}
                      className="truncate font-mono text-sm font-semibold text-primary-navy hover:underline"
                    >
                      {s.page_key}
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-warm-gray">
                    블록 {s.block_count}개 · 최근 수정{" "}
                    {format(parseISO(s.updated_at), "yyyy.MM.dd HH:mm", {
                      locale: ko,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={customPagePublicHref(s.page_key)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-warm-gray transition hover:border-secondary-sky hover:text-primary-navy"
                  >
                    공개 보기 <ExternalLink className="size-3" />
                  </Link>
                  <Link
                    href={customPageAdminHref(s.page_key)}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-navy px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-navy/90"
                  >
                    편집 <Pencil className="size-3" />
                  </Link>
                  <DeleteButton
                    iconOnly
                    itemLabel={`페이지 "${s.page_key}" (블록 ${s.block_count}개)`}
                    action={deleteCustomPage.bind(null, s.page_key)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

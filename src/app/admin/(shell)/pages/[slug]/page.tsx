import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";
import { deleteCustomPage } from "@/lib/actions/page-blocks";
import {
  isValidPageKey,
  isHardcodedPageKey,
  customPagePublicHref,
} from "@/lib/page-keys";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `사용자 페이지 — ${slug}` };
}

export default async function AdminCustomPageEditor({ params }: Props) {
  const { slug } = await params;
  if (!isValidPageKey(slug) || isHardcodedPageKey(slug)) notFound();

  const blocks = await getPageBlocks(slug);

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title={`페이지 — ${slug}`}
        description={`공개 URL: /pages/${slug} — 블록을 추가/이동/삭제하면 즉시 반영됩니다. 첫 제목(heading) 블록이 페이지 타이틀로 사용됩니다.`}
        backHref="/admin/pages"
        actions={
          <>
            <Link
              href={customPagePublicHref(slug)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-warm-gray transition hover:border-secondary-sky hover:text-primary-navy"
            >
              공개 보기 <ExternalLink className="size-3.5" />
            </Link>
            <DeleteButton
              itemLabel={`페이지 "${slug}" (블록 ${blocks.length}개)`}
              action={deleteCustomPage.bind(null, slug)}
              redirectTo="/admin/pages"
            />
          </>
        }
      />
      <PageBlocksEditor pageKey={slug} blocks={blocks} />
    </div>
  );
}

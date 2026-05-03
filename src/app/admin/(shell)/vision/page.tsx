import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "교회 비전 추가 콘텐츠" };

export default async function AdminVisionPage() {
  const blocks = await getPageBlocks("vision");
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="교회 비전 — 추가 콘텐츠"
        description="교회 비전 페이지의 표어·3대 비전 카드 아래에 노출되는 추가 콘텐츠 블록입니다. (표어와 비전 카드는 [사이트 설정]에서 관리합니다.)"
      />
      <PageBlocksEditor pageKey="vision" blocks={blocks} />
    </div>
  );
}

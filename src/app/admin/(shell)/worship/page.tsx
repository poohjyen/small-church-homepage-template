import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "예배 안내 추가 콘텐츠" };

export default async function AdminWorshipPage() {
  const blocks = await getPageBlocks("worship");
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="예배 안내 — 추가 콘텐츠"
        description="예배 안내 페이지의 시간표·새벽기도회 아래에 노출되는 추가 콘텐츠 블록입니다. (예배 시간표와 새벽기도 제목은 [사이트 설정]에서 관리합니다.)"
      />
      <PageBlocksEditor pageKey="worship" blocks={blocks} />
    </div>
  );
}

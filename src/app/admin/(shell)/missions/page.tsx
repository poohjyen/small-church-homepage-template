import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "선교 페이지 관리" };

export default async function AdminMissionsPage() {
  const blocks = await getPageBlocks("missions");

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="선교 페이지"
        description="선교 소식 페이지의 콘텐츠를 블록 단위로 관리합니다. 제목·본문·이미지 블록을 자유롭게 추가하고 순서를 바꿀 수 있어요."
      />
      <PageBlocksEditor pageKey="missions" blocks={blocks} />
    </div>
  );
}

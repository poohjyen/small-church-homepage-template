import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "인사말 추가 콘텐츠" };

export default async function AdminAboutPage() {
  const blocks = await getPageBlocks("about");

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="인사말 — 추가 콘텐츠"
        description="인사말 페이지의 담임목사 인사말 아래에 노출되는 추가 콘텐츠 블록입니다. 제목·본문·이미지 블록을 자유롭게 추가하세요. (담임목사 인사말 본문은 [사이트 설정]에서 관리합니다.)"
      />
      <PageBlocksEditor pageKey="about" blocks={blocks} />
    </div>
  );
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageBlocksEditor } from "@/components/admin/PageBlocksEditor";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "오시는 길 추가 콘텐츠" };

export default async function AdminLocationPage() {
  const blocks = await getPageBlocks("location");
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="오시는 길 — 추가 콘텐츠"
        description="오시는 길 페이지의 지도·연락처 아래에 노출되는 추가 콘텐츠(주차/대중교통 안내 등)입니다. (주소·전화번호는 [사이트 설정]에서 관리합니다.)"
      />
      <PageBlocksEditor pageKey="location" blocks={blocks} />
    </div>
  );
}

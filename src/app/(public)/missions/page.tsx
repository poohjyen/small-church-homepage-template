import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { getPageBlocks } from "@/lib/data/page-blocks";

export const metadata = { title: "선교" };

export default async function MissionsPage() {
  const blocks = await getPageBlocks("missions");

  return (
    <>
      <PageHero eyebrow="MISSIONS" title="선교" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {blocks.length > 0 ? (
          <PageBlockContent blocks={blocks} />
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl bg-soft p-12 text-center text-warm-gray ring-1 ring-black/5">
            <p>아직 선교 소식이 등록되지 않았습니다.</p>
            <p className="mt-2 text-sm">
              관리자 페이지(/admin/missions)에서 선교 소식을 작성해주세요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { getPageBlocks } from "@/lib/data/page-blocks";
import { isValidPageKey, isHardcodedPageKey } from "@/lib/page-keys";

type Props = {
  params: Promise<{ slug: string }>;
};

// 첫 heading 블록을 페이지 제목으로 사용 (없으면 슬러그)
function pickTitle(blocks: { type: string; title: string | null }[], fallback: string) {
  const heading = blocks.find((b) => b.type === "heading" && b.title);
  return heading?.title?.trim() || fallback;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isValidPageKey(slug) || isHardcodedPageKey(slug)) {
    return { title: "페이지를 찾을 수 없습니다" };
  }
  const blocks = await getPageBlocks(slug);
  if (blocks.length === 0) return { title: "페이지를 찾을 수 없습니다" };
  return { title: pickTitle(blocks, slug) };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidPageKey(slug) || isHardcodedPageKey(slug)) notFound();

  const blocks = await getPageBlocks(slug);
  if (blocks.length === 0) notFound();

  const title = pickTitle(blocks, slug);
  // 제목으로 쓰인 첫 heading 블록은 본문에서 제외
  const firstHeadingId = blocks.find((b) => b.type === "heading" && b.title)?.id;
  const bodyBlocks = firstHeadingId
    ? blocks.filter((b) => b.id !== firstHeadingId)
    : blocks;

  return (
    <>
      <PageHero eyebrow="PAGE" title={title} />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <PageBlockContent blocks={bodyBlocks} />
      </div>
    </>
  );
}

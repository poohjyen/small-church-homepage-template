import Image from "next/image";

import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { getSiteSetting } from "@/lib/data/site";
import { getPageBlocks } from "@/lib/data/page-blocks";
import { CHURCH } from "../../../../church.config";

export const metadata = { title: "인사말" };

const PASTOR_PHOTO_PLACEHOLDER = "/images/pastor-placeholder.svg";

export default async function AboutPage() {
  const [greeting, blocks] = await Promise.all([
    getSiteSetting("pastor_greeting"),
    getPageBlocks("about"),
  ]);
  const fallbackName = CHURCH.pastorName.replace(/\s*목사\s*$/, "");
  const fallbackBody = `${CHURCH.name} 홈페이지를 찾아주신 모든 분들을 진심으로 환영합니다.\n\n언제든지 편안한 마음으로 찾아오셔서 함께 예배드리고 교제 나누시기를 바랍니다.`;
  const name = greeting?.name?.trim() || fallbackName;
  const photo = greeting?.photo_url?.trim() || PASTOR_PHOTO_PLACEHOLDER;
  const body = greeting?.body?.trim() || fallbackBody;
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const isSvgPhoto = photo.endsWith(".svg");

  return (
    <>
      <PageHero eyebrow="GREETING" title="인사말" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[480px_1fr] md:items-start md:gap-12">
        <figure className="mx-auto md:mx-0">
          <div className="overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5">
            {isSvgPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={`${name} ${CHURCH.pastorTitle}`}
                className="h-auto w-full object-cover"
              />
            ) : (
              <Image
                src={photo}
                alt={`${name} ${CHURCH.pastorTitle}`}
                width={480}
                height={501}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 380px, 480px"
              />
            )}
          </div>
        </figure>

        <div className="space-y-6 text-base leading-loose text-charcoal md:text-lg">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}

          <p className="pt-6 text-right text-base font-semibold text-primary-navy md:text-lg">
            {CHURCH.pastorTitle} {name} 드림
          </p>
        </div>
        </div>

        {blocks.length > 0 ? (
          <div className="mt-16 border-t border-slate-200 pt-12">
            <PageBlockContent blocks={blocks} />
          </div>
        ) : null}
      </div>
    </>
  );
}

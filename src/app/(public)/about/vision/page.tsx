import Image from "next/image";

import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { getSiteSetting } from "@/lib/data/site";
import { getPageBlocks } from "@/lib/data/page-blocks";
import { CHURCH } from "../../../../../church.config";

export const metadata = { title: "교회 비전" };

const VISION_PLACEHOLDER = "/images/vision-placeholder.svg";

const VISION_STYLES = [
  { bg: "bg-primary-navy", text: "text-white", sub: "text-white/80", indexColor: "text-white/70" },
  { bg: "bg-secondary-sky", text: "text-white", sub: "text-white/85", indexColor: "text-white/75" },
  { bg: "bg-accent-coral", text: "text-white", sub: "text-white", indexColor: "text-white/85" },
];

export default async function VisionPage() {
  const [yearMotto, visionThree, heroImages, blocks] = await Promise.all([
    getSiteSetting("year_motto"),
    getSiteSetting("vision_three"),
    getSiteSetting("page_hero_images"),
    getPageBlocks("vision"),
  ]);
  const scripture = yearMotto?.scripture?.trim() || "";
  const body = yearMotto?.body?.trim() || "";
  const motto = yearMotto?.motto?.trim() || "";
  const visionImage = heroImages?.vision || VISION_PLACEHOLDER;
  const isSvg = visionImage.endsWith(".svg");

  const visions = [
    { index: "01", title: visionThree?.v1?.trim() || "", ...VISION_STYLES[0] },
    { index: "02", title: visionThree?.v2?.trim() || "", ...VISION_STYLES[1] },
    { index: "03", title: visionThree?.v3?.trim() || "", ...VISION_STYLES[2] },
  ].filter((v) => v.title.length > 0);

  return (
    <>
      <PageHero eyebrow="VISION" title="교회 비전" />

      <div className="container mx-auto px-4 py-12 md:py-16">

      {motto ? (
        <figure className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
          {isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={visionImage}
              alt={`${yearMotto?.year ?? ""} ${CHURCH.name} 표어: ${motto}`.trim()}
              className="h-auto w-full"
            />
          ) : (
            <Image
              src={visionImage}
              alt={`${yearMotto?.year ?? ""} ${CHURCH.name} 표어: ${motto}`.trim()}
              width={1280}
              height={781}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full"
              preload
            />
          )}
        </figure>
      ) : null}

      {(scripture || body) ? (
        <section className="mx-auto mt-12 max-w-3xl rounded-2xl bg-soft p-8 text-center ring-1 ring-black/5 md:p-10">
          {scripture ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-warm-gray">
              {scripture}
            </p>
          ) : null}
          {body ? (
            <blockquote className="mt-5 whitespace-pre-line text-lg leading-loose text-charcoal md:text-xl">
              {body}
            </blockquote>
          ) : null}
        </section>
      ) : null}

      {visions.length > 0 ? (
        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-charcoal md:text-3xl">
            {CHURCH.name} {visions.length}대 비전
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {visions.map((v) => (
              <li
                key={v.title}
                className={`${v.bg} ${v.text} rounded-2xl p-8 shadow-sm transition hover:shadow-lg`}
              >
                <p className={`text-sm font-bold tracking-[0.3em] ${v.indexColor}`}>
                  {v.index}
                </p>
                <h3 className="mt-5 text-xl font-bold leading-snug">{v.title}</h3>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {blocks.length > 0 ? (
        <div className="mt-16 border-t border-slate-200 pt-12">
          <PageBlockContent blocks={blocks} />
        </div>
      ) : null}
      </div>
    </>
  );
}

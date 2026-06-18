import { format } from "date-fns";

import { FadeIn } from "@/components/ui/fade-in";
import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Sermon } from "@/types/database";

import { SectionContainer } from "./SectionContainer";

const YT_PARAMS = "rel=0&modestbranding=1&iv_load_policy=3&playsinline=1";

type Props = { sermon: Sermon | null };

export function FeaturedSermonSection({ sermon }: Props) {
  if (!sermon) {
    return (
      <SectionContainer bg="plain" className="py-6 md:py-12">
        <FadeIn direction="down">
          <SectionHeading eyebrow="FEATURED SERMON" title="이번 주 말씀" />
        </FadeIn>
        <div className="mt-8 border border-black/5 bg-soft p-12 text-center text-warm-gray ring-1 ring-black/5">
          아직 등록된 설교가 없습니다.
          <br className="hidden md:block" />
          <span className="text-sm">
            관리자 페이지(/admin/sermons)에서 설교를 등록해 주세요.
          </span>
        </div>
      </SectionContainer>
    );
  }
  return (
    <SectionContainer bg="plain" className="py-6 md:py-12">
      <FadeIn direction="down">
        <SectionHeading eyebrow="FEATURED SERMON" title="이번 주 말씀" />
      </FadeIn>

      {/* 모바일: 영상만 */}
      <div className="mt-4 md:hidden">
        <div className="overflow-hidden border border-primary-navy/15 bg-soft p-1.5 shadow-sm md:p-2">
          <div className="relative aspect-video w-full">
            <iframe
              title={sermon.title}
              src={`https://www.youtube.com/embed/${sermon.youtube_id}?${YT_PARAMS}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          </div>
        </div>
      </div>

      {/* 데스크톱: 기존 2-컬럼 레이아웃 — 좌(영상)·우(텍스트) 교차 등장 */}
      <div className="mt-8 hidden gap-8 md:grid md:gap-10 lg:grid-cols-[1.4fr_1fr]">
        <FadeIn
          direction="right"
          className="overflow-hidden border border-primary-navy/15 bg-soft p-1.5 shadow-sm md:p-2"
        >
          <div className="relative aspect-video w-full">
            <iframe
              title={sermon.title}
              src={`https://www.youtube.com/embed/${sermon.youtube_id}?${YT_PARAMS}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={120} className="flex flex-col justify-center">
          {sermon.scripture ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              {sermon.scripture}
            </p>
          ) : null}
          <h3 className="mt-3 text-2xl font-bold leading-snug text-primary-navy md:text-3xl">
            {sermon.title}
          </h3>
          <div className="mt-4 flex items-center gap-3 text-sm text-warm-gray md:text-base">
            <span>{sermon.preacher}</span>
            <span aria-hidden>·</span>
            <time dateTime={sermon.sermon_date}>
              {format(new Date(sermon.sermon_date), "yyyy.MM.dd")}
            </time>
          </div>
          {sermon.summary ? (
            <p className="mt-6 line-clamp-3 text-base leading-loose text-charcoal md:line-clamp-5 md:text-lg">
              {sermon.summary}
            </p>
          ) : null}
          <div className="mt-8">
            <MoreLink href={`/sermons/${sermon.id}`} tone="navy">
              설교 자세히 보기
            </MoreLink>
          </div>
        </FadeIn>
      </div>
    </SectionContainer>
  );
}

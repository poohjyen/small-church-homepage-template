import Image from "next/image";

import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteSetting } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

const FALLBACK_VISION_IMAGE = CHURCH.ogImage || "/images/vision-placeholder.svg";
const FALLBACK_MOTTO = "함께 세워가는 신앙 공동체";

type Props = {
  motto?: SettingValueMap["year_motto"] | null;
};

export async function VisionCardSection({ motto }: Props = {}) {
  const visionUrl = await getSiteSetting("vision_image_url");
  const src =
    typeof visionUrl === "string" && visionUrl ? visionUrl : FALLBACK_VISION_IMAGE;
  const safeUrl = src.replace(/["\\\n\r]/g, "");

  const year = motto?.year ?? 2026;
  const mottoText = motto?.motto?.trim();

  return (
    <section
      aria-label="목회 비전"
      className="relative isolate overflow-hidden bg-primary-navy text-white"
    >
      {/* 배경 레이어: PC는 bg-fixed로 뷰포트에 고정(스크롤 시 사진은 멈추고 글자만 위로 지나감),
          모바일은 bg-scroll 폴백(bg-fixed는 iOS에서 깨짐).
          ※ 이 div에 filter/opacity를 직접 걸면 bg-fixed 패럴럭스가 깨지므로 어둡기는 아래 오버레이로 처리 */}
      <div
        aria-hidden
        style={{ backgroundImage: `url("${safeUrl}")` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll motion-safe:md:bg-fixed"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-primary-navy/95 via-primary-navy/85 to-primary-navy/60"
      />

      <div className="container relative mx-auto grid items-center gap-8 px-4 py-6 md:py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
        <div>
          <SectionHeading
            align="left"
            tone="dark"
            size="lg"
            eyebrow={`VISION ${year}`}
            title={
              mottoText ? (
                <span className="break-keep">{mottoText}</span>
              ) : (
                <span className="break-keep">{FALLBACK_MOTTO}</span>
              )
            }
          />
          <p className="mt-6 text-base leading-loose text-white/85 md:text-lg md:leading-loose">
            <span className="md:hidden">
              예배와 말씀, 교제와 섬김으로 한 마음을 이루어 가는 공동체입니다.
            </span>
            <span className="hidden md:inline">
              {CHURCH.name}는 예배와 말씀, 교제와 섬김으로
              <br />
              한 마음을 이루어 가는 신앙 공동체입니다.
            </span>
          </p>
          <div className="mt-10">
            <MoreLink href="/about/vision" tone="white">
              목회 비전 자세히 보기
            </MoreLink>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/3] overflow-hidden border border-white/15 shadow-2xl">
            <Image
              src={src}
              alt={`${year}년 ${CHURCH.name} 표어: ${mottoText || FALLBACK_MOTTO}`}
              fill
              sizes="(max-width: 1024px) 50vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

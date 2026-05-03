import Image from "next/image";

import { MoreLink } from "@/components/ui/more-link";
import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

const VISION_IMAGE = "/images/vision-placeholder.svg";

export async function VisionCardSection() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const motto = settings.year_motto as SettingValueMap["year_motto"] | undefined;
  const heroImages = settings.page_hero_images as SettingValueMap["page_hero_images"] | undefined;

  const visionImage = heroImages?.vision || CHURCH.ogImage || VISION_IMAGE;
  const eyebrow = motto?.year ? `VISION ${motto.year}` : "VISION";
  const headline = motto?.motto ?? "함께 세워가는 신앙 공동체";
  const body = motto?.body
    ? motto.body
    : `${CHURCH.name}는 예배와 말씀, 교제와 섬김으로 한 마음을 이루어 가고 있습니다.`;

  const isSvg = visionImage.endsWith(".svg");

  return (
    <section
      aria-label="목회 비전"
      className="relative overflow-hidden bg-primary-navy text-white"
    >
      <div className="absolute inset-0">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={visionImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            aria-hidden
          />
        ) : (
          <Image
            src={visionImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
            aria-hidden
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-primary-navy/95 via-primary-navy/85 to-primary-navy/60"
        />
      </div>

      <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 md:py-28 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.5em] text-accent-coral">
            {eyebrow}
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl whitespace-pre-line">
            {headline}
          </h2>
          <p className="mt-6 text-base leading-loose text-white/85 md:text-lg md:leading-loose whitespace-pre-line">
            {body}
          </p>
          <div className="mt-10">
            <MoreLink href="/about/vision" tone="white">
              목회 비전 자세히 보기
            </MoreLink>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/15">
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={visionImage}
                alt={`${motto?.year ?? ""} 교회 표어`.trim() || `${CHURCH.name} 비전`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={visionImage}
                alt={`${motto?.year ?? ""} 교회 표어`.trim() || `${CHURCH.name} 비전`}
                fill
                sizes="(max-width: 1024px) 50vw, 600px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

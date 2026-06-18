import { CreditCard } from "lucide-react";

import { ParallaxBackdrop } from "@/components/sections/ParallaxBackdrop";
import { SectionHeading } from "@/components/ui/section-heading";
import type { OfferingAccountItem } from "@/types/database";

type Props = { accounts: OfferingAccountItem[]; bgImage?: string };

export function OnlineGivingSection({ accounts, bgImage }: Props) {
  const multi = accounts.length > 1;

  // 데스크톱 풀폭 밴드 내부 (배경만 사진/단색으로 갈아끼움)
  const deskInner = (
    <div className="container mx-auto px-4">
      <SectionHeading eyebrow="OFFERING" title="온라인 헌금" tone="dark" />

      <ul className="mx-auto mt-6 flex max-w-5xl flex-col gap-4 md:flex-row md:justify-center">
        {accounts.map((a) => (
          <li
            key={a.dept}
            className="flex items-start gap-3 border border-white/15 bg-white/5 px-5 py-4 md:max-w-sm md:flex-1"
          >
            <CreditCard
              className="mt-0.5 size-5 shrink-0 text-secondary-sky"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              {multi && (
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                  {a.dept}
                </p>
              )}
              <p className="break-keep text-base font-medium leading-snug md:text-lg">
                {a.account}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-white/70">
        헌금 종류와 성함을 함께 적어주세요. 예){" "}
        <span className="font-semibold text-white">감사_홍길동</span>
      </p>
    </div>
  );

  return (
    <section id="offering" aria-label="온라인 헌금">
      {/* 모바일 — 흰 배경, 가로로 긴 막대형 계좌 (위→아래) */}
      <div className="bg-canvas py-4 md:hidden">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="OFFERING" title="온라인 헌금" />
          <ul className="mx-auto mt-4 flex max-w-2xl flex-col gap-2">
            {accounts.map((a) => (
              <li
                key={a.dept}
                className="flex items-center gap-3 overflow-hidden bg-primary-navy px-4 py-3 text-white shadow-md"
              >
                <CreditCard
                  className="size-5 shrink-0 text-secondary-sky"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {multi && (
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
                    {a.dept}
                  </span>
                )}
                <span className="break-keep text-[15px] font-medium leading-snug">
                  {a.account}
                </span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-2 max-w-2xl text-[11px] leading-relaxed text-warm-gray">
            헌금 종류와 성함을 함께 적어주세요. 예){" "}
            <span className="font-semibold text-primary-navy">감사_홍길동</span>
          </p>
        </div>
      </div>

      {/* 데스크톱 — 풀 블리드 밴드 (사진 배경 + 네이비 오버레이 패럴럭스, 모바일엔 미표시) */}
      {bgImage ? (
        <ParallaxBackdrop
          image={bgImage}
          overlayClassName="bg-primary-navy/88"
          className="hidden md:block"
        >
          <div className="py-6 text-white md:py-10">{deskInner}</div>
        </ParallaxBackdrop>
      ) : (
        <div className="hidden bg-primary-navy py-6 text-white md:block md:py-10">
          {deskInner}
        </div>
      )}
    </section>
  );
}

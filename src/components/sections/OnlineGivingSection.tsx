import { CreditCard, HandHeart, Info } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import type { OfferingAccountItem } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { SectionContainer } from "./SectionContainer";

type Props = { accounts?: OfferingAccountItem[] };

export function OnlineGivingSection({ accounts }: Props = {}) {
  const items = accounts ?? [];
  if (items.length === 0) return null;
  return (
    <SectionContainer bg="white" id="offering">
      <SectionHeading eyebrow="OFFERING" title="온라인 헌금" />

      <div className="mx-auto mt-6 max-w-4xl md:mt-12">
        <div className="overflow-hidden rounded-2xl bg-primary-navy text-white shadow-xl md:rounded-3xl">
          {/* 모바일: 한 박스에 3개 계좌 컴팩트 정렬 */}
          <div className="flex flex-col gap-3 px-5 py-5 md:hidden">
            <div className="flex items-start gap-3">
              <CreditCard
                className="mt-0.5 size-5 shrink-0 text-secondary-sky"
                strokeWidth={1.5}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  Account
                </p>
                <ul className="mt-1.5 space-y-1">
                  {items.map((a) => (
                    <li
                      key={a.dept}
                      className="break-keep text-sm font-bold leading-snug"
                    >
                      {a.dept}
                      <span className="ml-1 font-semibold text-white/85">
                        ({a.account})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-white/80">
              헌금 종류와 성함을 함께 적어주세요. 예){" "}
              <span className="font-semibold text-white">감사_홍길동</span>
            </p>
          </div>

          {/* 데스크톱: 좌 하트 + 우 3계좌 안내 */}
          <div className="hidden md:grid md:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col items-center justify-center bg-secondary-sky/95 px-8 py-10 text-center md:py-14">
              <HandHeart
                className="size-14 text-white"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="mt-5 text-lg font-bold md:text-xl">
                {CHURCH.name} 헌금 계좌
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
                온라인뱅킹 · 모바일뱅킹으로
                <br />
                간편하게 드릴 수 있습니다
              </p>
            </div>

            <div className="px-8 py-10 md:px-12 md:py-14">
              <div className="flex items-start gap-4">
                <CreditCard
                  className="mt-1 size-7 shrink-0 text-secondary-sky"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    Account
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {items.map((a) => (
                      <li
                        key={a.dept}
                        className="break-keep text-base font-bold leading-snug md:text-lg"
                      >
                        {a.dept}
                        <span className="ml-2 font-semibold text-white/85">
                          ({a.account})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                <Info
                  className="mt-0.5 size-5 shrink-0 text-white/80"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="text-sm leading-relaxed text-white/90 md:text-base">
                  <p className="font-semibold">입금자명 안내</p>
                  <p className="mt-1 text-white/80">
                    헌금 종류와 성함을 함께 적어주세요. <br />
                    예){" "}
                    <span className="font-semibold text-white">감사_홍길동</span>
                    {" · "}
                    <span className="font-semibold text-white">십일조_홍길동</span>
                    {" · "}
                    <span className="font-semibold text-white">선교_홍길동</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

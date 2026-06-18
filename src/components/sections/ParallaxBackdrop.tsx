import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 풀폭 섹션 뒤에 사진을 깔고 그 위에 브랜드색 오버레이를 덮는 배경 래퍼.
 * VisionCardSection / ParallaxHero 와 동일한 패럴럭스 방식:
 *  - PC: bg-fixed (스크롤 시 사진은 멈추고 내용만 위로 지나감)
 *  - 모바일: bg-scroll + ken-burns 줌 (bg-fixed 는 iOS 에서 깨지므로 미적용)
 * 내용(children)은 오버레이 위 레이어에 그대로 렌더한다.
 */
export function ParallaxBackdrop({
  image,
  overlayClassName = "bg-primary-navy/88",
  className,
  children,
}: {
  image: string;
  /** 사진 위 브랜드색 오버레이 (글자·카드 가독성 확보). 예: bg-primary-navy/88, bg-secondary-sky/85 */
  overlayClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const safeUrl = image.replace(/["\\\n\r]/g, "");

  return (
    <div className={cn("relative isolate overflow-hidden bg-primary-navy", className)}>
      {/* 배경 사진 레이어 — ※ 이 div 에 filter/opacity 를 직접 걸면 PC bg-fixed 패럴럭스가
          깨지므로, 어둡기는 반드시 아래 별도 오버레이로 처리한다. */}
      <div
        aria-hidden
        style={{ backgroundImage: `url("${safeUrl}")` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll motion-safe:md:bg-fixed max-md:animate-ken-burns"
      />
      {/* 브랜드색 오버레이 */}
      <div aria-hidden className={cn("absolute inset-0", overlayClassName)} />
      {/* 내용 */}
      <div className="relative">{children}</div>
    </div>
  );
}

"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/**
 * 공개 폼용 Cloudflare Turnstile widget.
 *
 * - NEXT_PUBLIC_TURNSTILE_SITE_KEY 미설정 시 렌더 안 함 (개발 편의).
 * - 검증 성공 시 onToken 콜백으로 토큰 전달 → 폼 제출 시 server action에 함께 전송.
 */
export function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <div className="flex justify-center py-2">
      <Turnstile
        siteKey={siteKey}
        onSuccess={onToken}
        onError={() => onToken("")}
        onExpire={() => onToken("")}
        options={{ theme: "light", size: "normal" }}
      />
    </div>
  );
}

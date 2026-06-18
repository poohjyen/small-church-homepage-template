import "server-only";
import { headers } from "next/headers";

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true } | { ok: false; error: string };

/**
 * Cloudflare Turnstile 토큰 서버 검증.
 *
 * - TURNSTILE_SECRET_KEY 미설정 시 검증을 통과시킴 (개발 환경 편의).
 *   운영에서는 Vercel 환경변수에 반드시 등록 필요.
 * - 추가 1차 봇 방어 레이어.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true };
  }
  if (!token) {
    return {
      ok: false,
      error: "봇 방어 인증이 필요합니다. 페이지를 새로고침 후 다시 시도해 주세요.",
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    undefined;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[turnstile] verify request failed:", res.status);
      return { ok: false, error: "봇 방어 인증 실패. 다시 시도해 주세요." };
    }
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.error("[turnstile] verification failed:", data["error-codes"]);
      return { ok: false, error: "봇 방어 인증 실패. 다시 시도해 주세요." };
    }
    return { ok: true };
  } catch (e) {
    console.error("[turnstile] verify error:", e);
    return { ok: false, error: "봇 방어 인증 중 오류. 다시 시도해 주세요." };
  }
}

import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "";

// DSN 미설정 시 Sentry 비활성 (no-op) — 운영에서 NEXT_PUBLIC_SENTRY_DSN 등록 시 활성화
if (dsn) {
  Sentry.init({
    dsn,
    // 운영 비용 절감 — 트랜잭션 샘플링 10%
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === "production",
  });
}

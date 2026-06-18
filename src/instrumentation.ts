import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Server Components / Route Handlers / Server Actions 에서 발생한
// uncaught error를 자동으로 Sentry로 전송
export const onRequestError = Sentry.captureRequestError;

"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Noto Sans KR", system-ui, sans-serif',
          background: "#F8F6F2",
          color: "#1F2937",
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#DC2626",
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            CRITICAL ERROR
          </p>
          <h1 style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
            예기치 못한 오류가 발생했습니다
          </h1>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              lineHeight: 1.6,
              color: "#6B7280",
            }}
          >
            페이지를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: 16,
                display: "inline-block",
                background: "#F8F6F2",
                padding: "4px 12px",
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 11,
                color: "#6B7280",
              }}
            >
              오류 코드: {error.digest}
            </p>
          ) : null}
          <div style={{ marginTop: 32 }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                background: "#1E3A5F",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

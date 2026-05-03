import { Resend } from "resend";
import { CHURCH } from "../../../church.config";

// 발신 주소: 운영 시 RESEND_FROM에 검증된 도메인 주소 설정
//   예) RESEND_FROM="<교회명> <noreply@<도메인>>"
// 미설정 시 Resend 테스트 도메인을 사용 (스팸함 행 가능성 ↑)
function fromAddress(): string {
  const env = process.env.RESEND_FROM?.trim();
  if (env && env.length > 0) return env;
  return `${CHURCH.name} <onboarding@resend.dev>`;
}

let cached: Resend | null = null;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

async function getAdminEmail(): Promise<string | null> {
  // 1) 환경변수 우선 (가장 빠르고 명시적)
  const envEmail = process.env.RESEND_TO?.trim();
  if (envEmail && envEmail.includes("@")) return envEmail;

  // 2) admin_users 테이블의 첫 admin 이메일
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("admin_users")
      .select("email")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<{ email: string }>();
    const email = data?.email;
    if (typeof email === "string" && email.includes("@")) return email;
  } catch {
    // ignore — return null below
  }
  return null;
}

type SendArgs = {
  subject: string;
  html: string;
  text?: string;
};

export async function sendAdminNotification({
  subject,
  html,
  text,
}: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const resend = client();
  if (!resend) {
    return { ok: false, error: "Resend API key not configured" };
  }
  const to = await getAdminEmail();
  if (!to) {
    return { ok: false, error: "Admin email not configured" };
  }
  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
      text: text ?? html.replace(/<[^>]+>/g, ""),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function row(label: string, value: string | null | undefined): string {
  const safe = value && value.trim().length > 0 ? escapeHtml(value) : "—";
  return `<tr><td style="padding:8px 12px;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#111827">${safe}</td></tr>`;
}

export function wrapTable(title: string, rowsHtml: string): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;max-width:560px">
<h2 style="margin:0 0 16px;font-size:18px;color:#0f172a">${escapeHtml(title)}</h2>
<table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">${rowsHtml}</table>
<p style="margin-top:16px;font-size:12px;color:#94a3b8">${escapeHtml(CHURCH.name)} 홈페이지 자동 알림</p>
</div>`;
}

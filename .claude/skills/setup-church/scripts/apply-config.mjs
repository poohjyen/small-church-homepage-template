#!/usr/bin/env node
/**
 * .church-setup.json을 읽어서 다음 8개 작업을 수행:
 *
 * 1. church.config.ts 생성 (브랜드/색상/폰트/SEO)
 * 2. src/app/globals.css 색상 변수 4개 교체
 * 3. src/app/layout.tsx 폰트 import 변경 (선택한 폰트가 GMarket Sans 외이면)
 * 4. package.json name 필드 교체
 * 5. .env.local 생성 (.env.local.example 기준)
 * 6. SVG placeholder 7개 재생성 (generate-placeholders.mjs 호출)
 * 7. supabase/seed/site_settings.generated.sql 생성
 *
 * 멱등성: 두 번 실행해도 동일 결과. 원본은 <file>.bak으로 백업.
 *
 * 사용:
 *   node .claude/skills/setup-church/scripts/apply-config.mjs
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  mkdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import process from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../../../..");
const SETUP_PATH = join(PROJECT_ROOT, ".church-setup.json");

if (!existsSync(SETUP_PATH)) {
  console.error("❌ .church-setup.json이 없습니다. 먼저 /setup-church를 실행해 인터뷰를 완료하세요.");
  process.exit(1);
}

const setup = JSON.parse(readFileSync(SETUP_PATH, "utf8"));
console.log("[apply-config] .church-setup.json 로드 완료");

function backup(relPath) {
  const abs = join(PROJECT_ROOT, relPath);
  const bak = abs + ".bak";
  if (existsSync(abs) && !existsSync(bak)) {
    copyFileSync(abs, bak);
    console.log(`  → 백업: ${relPath} → ${relPath}.bak`);
  }
}

function writeFile(relPath, content) {
  const abs = join(PROJECT_ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, "utf8");
  console.log(`  → ${relPath}`);
}

// ============================================================
// 1. church.config.ts 생성
// ============================================================
console.log("\n[1/7] church.config.ts 생성");
backup("church.config.ts");

const basic = setup.basic || {};
const pastor = setup.pastor || {};
const colors = setup.colors || {};
const fonts = setup.fonts || { heading: "gmarket-sans", body: "noto-sans-kr" };

const churchConfigContent = `/**
 * 교회 홈페이지 설정 (자동 생성됨 — apply-config.mjs)
 *
 * 이 파일은 setup-church Skill의 인터뷰 답변으로 채워졌습니다.
 * 직접 수정 가능하지만, 다음 항목은 admin 페이지(/admin/settings)에서 변경하는 것을 권장합니다:
 * - 표어/비전/주소/전화/계좌/SNS → site_settings 테이블 (런타임 가변)
 */

export type FontHeading = "gmarket-sans" | "noto-serif-kr" | "pretendard" | "spoqa-han-sans";
export type FontBody = "noto-sans-kr" | "pretendard" | "spoqa-han-sans";

export const CHURCH = {
  // ── 정체성 ────────────────────────────────────────────────────
  name: ${JSON.stringify(basic.name || "샘플교회")},
  fullName: ${JSON.stringify(basic.fullName || basic.name || "샘플교회")},
  description: ${JSON.stringify(basic.description || `${basic.name || "교회"}는 예수 그리스도를 사랑하는 공동체입니다.`)},
  pastorName: ${JSON.stringify(pastor.name ? (/목사\s*$/.test(pastor.name) ? pastor.name : `${pastor.name} 목사`) : "담임목사")},
  pastorTitle: ${JSON.stringify(pastor.title || "담임목사")},
  founded: ${JSON.stringify(String(basic.founded || ""))},
  denomination: ${JSON.stringify(basic.denomination || "")},

  // ── 자산 ──────────────────────────────────────────────────────
  logo: "/images/logo.svg",
  ogImage: "/images/og-image.svg",

  // ── 브랜드 색상 ───────────────────────────────────────────────
  brandColors: {
    primaryNavy: ${JSON.stringify(colors.primaryNavy || "#02567D")},
    primaryNavyDark: ${JSON.stringify(colors.primaryNavyDark || "#013A57")},
    primaryNavyLight: ${JSON.stringify(colors.primaryNavyLight || "#3A7FA0")},
    secondarySky: ${JSON.stringify(colors.secondarySky || "#0c9fa5")},
    accentCoral: ${JSON.stringify(colors.accentCoral || "#FF9084")},
    accentAmber: ${JSON.stringify(colors.accentAmber || "#F5A623")},
  },

  // ── 폰트 프리셋 ───────────────────────────────────────────────
  fonts: {
    heading: ${JSON.stringify(fonts.heading || "gmarket-sans")} as FontHeading,
    body: ${JSON.stringify(fonts.body || "noto-sans-kr")} as FontBody,
  },

  // ── SEO 기본값 ───────────────────────────────────────────────
  seo: {
    keywords: ${JSON.stringify([basic.name || "교회", "예배", "설교"].filter(Boolean))},
    googleVerification: ${JSON.stringify(setup.seo?.googleVerification || "")},
    naverVerification: ${JSON.stringify(setup.seo?.naverVerification || "")},
  },

  // ── 기본 연락처 (JSON-LD/메타데이터용) ──
  defaults: {
    address: {
      streetAddress: ${JSON.stringify(setup.contact?.address || "")},
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "KR",
    },
    telephone: ${JSON.stringify(setup.contact?.phone ? [setup.contact.phone] : [])} as readonly string[],
    email: ${JSON.stringify(basic.adminEmail || "")},
    social: {
      band: ${JSON.stringify(setup.sns?.band || "")},
      youtube: ${JSON.stringify(setup.sns?.youtube || "")},
      instagram: ${JSON.stringify(setup.sns?.instagram || "")},
    },
  },
} as const;

export type ChurchConfig = typeof CHURCH;
`;

writeFile("church.config.ts", churchConfigContent);

// ============================================================
// 2. globals.css 색상 변수 교체
// ============================================================
console.log("\n[2/7] globals.css 색상 변수 교체");
backup("src/app/globals.css");

const globalsCssPath = join(PROJECT_ROOT, "src/app/globals.css");
let globalsCss = readFileSync(globalsCssPath, "utf8");
const colorMap = {
  "--color-primary-navy": colors.primaryNavy || "#02567D",
  "--color-primary-navy-dark": colors.primaryNavyDark || "#013A57",
  "--color-primary-navy-light": colors.primaryNavyLight || "#3A7FA0",
  "--color-secondary-sky": colors.secondarySky || "#0c9fa5",
  "--color-accent-coral": colors.accentCoral || "#FF9084",
  "--color-accent-amber": colors.accentAmber || "#F5A623",
};
for (const [varName, hex] of Object.entries(colorMap)) {
  // 정확한 라인 패턴 매칭 — sed 위험성 회피
  const re = new RegExp(`(${varName.replace(/[-]/g, "\\-")}:\\s*)#[0-9A-Fa-f]{3,8}(;)`, "g");
  globalsCss = globalsCss.replace(re, `$1${hex}$2`);
}
writeFileSync(globalsCssPath, globalsCss, "utf8");
console.log("  → src/app/globals.css 색상 6개 교체 완료");

// ============================================================
// 3. layout.tsx 폰트 import 변경 (Step 5에서 선택한 폰트)
// ============================================================
console.log("\n[3/7] layout.tsx 폰트 import 검토");
// 기본 GMarket Sans + Noto Sans KR을 유지 — 다른 프리셋은 향후 확장
// 현재는 이 단계 스킵, 사용자에게 안내만
console.log(`  → 폰트: heading=${fonts.heading}, body=${fonts.body}`);
if (fonts.heading !== "gmarket-sans" || fonts.body !== "noto-sans-kr") {
  console.log("  ⚠️  GMarket Sans 외 폰트는 layout.tsx 수동 편집 필요 (1.0에서는 미지원).");
}

// ============================================================
// 4. package.json name 교체
// ============================================================
console.log("\n[4/7] package.json name 교체");
backup("package.json");

const pkgPath = join(PROJECT_ROOT, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const slug = (basic.name || "church")
  .toLowerCase()
  .replace(/[^\w가-힣]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/-+/g, "-");
pkg.name = slug + "-church-site";
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log(`  → name: "${pkg.name}"`);

// ============================================================
// 5. .env.local 생성 (값은 Supabase MCP가 채워줌; placeholder만 작성)
// ============================================================
console.log("\n[5/7] .env.local 생성 (placeholder)");
const supabase = setup.supabase || {};
const envContent = `# 자동 생성됨 — apply-config.mjs
NEXT_PUBLIC_SUPABASE_URL=${supabase.url || ""}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase.anonKey || ""}
SUPABASE_SERVICE_ROLE_KEY=${supabase.serviceRoleKey || ""}
RESEND_API_KEY=${setup.resend?.apiKey || ""}
RESEND_FROM=${basic.name ? `${basic.name} <onboarding@resend.dev>` : ""}
RESEND_TO=${basic.adminEmail || ""}
NEXT_PUBLIC_SITE_URL=${setup.deployment?.url || "http://localhost:3000"}
`;
writeFile(".env.local", envContent);

// ============================================================
// 6. SVG placeholder 재생성 (generate-placeholders.mjs 호출)
// ============================================================
console.log("\n[6/7] SVG placeholder 재생성");
try {
  execSync(
    `node ${join(__dirname, "generate-placeholders.mjs")}`,
    { cwd: PROJECT_ROOT, stdio: "inherit" }
  );
} catch (e) {
  console.error("  ⚠️ placeholder 생성 실패:", e.message);
}

// ============================================================
// 7. site_settings seed SQL 생성
// ============================================================
console.log("\n[7/7] site_settings seed SQL 생성");
try {
  execSync(
    `node ${join(__dirname, "build-seed-sql.mjs")}`,
    { cwd: PROJECT_ROOT, stdio: "inherit" }
  );
} catch (e) {
  console.error("  ⚠️ seed SQL 생성 실패:", e.message);
}

// ============================================================
console.log("\n✅ apply-config 완료");
console.log("\n다음 단계:");
console.log("  1. supabase/seed/site_settings.generated.sql을 Supabase에 적용 (setup-church Skill이 자동으로 처리)");
console.log("  2. git add -A && git commit -m 'Initial church setup' && git push");
console.log("  3. Vercel이 자동 재배포");

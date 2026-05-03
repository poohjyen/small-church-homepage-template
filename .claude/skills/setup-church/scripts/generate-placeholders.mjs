#!/usr/bin/env node
/**
 * SVG placeholder 일괄 생성기.
 *
 * 사용:
 *   node .claude/skills/setup-church/scripts/generate-placeholders.mjs \
 *     --name "샘플교회" \
 *     --primary "#02567D" \
 *     --secondary "#0c9fa5"
 *
 * 또는 .church-setup.json이 존재하면 자동 로드:
 *   node .claude/skills/setup-church/scripts/generate-placeholders.mjs
 *
 * 산출물:
 *   public/images/logo.svg
 *   public/images/og-image.svg
 *   public/images/pastor-placeholder.svg
 *   public/images/vision-placeholder.svg
 *   public/images/hero/hero-1-placeholder.svg
 *   public/images/hero/hero-2-placeholder.svg
 *   public/images/hero/hero-3-placeholder.svg
 *   public/favicon.svg
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../../../..");

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k && k.startsWith("--")) out[k.slice(2)] = v ?? "";
  }
  return out;
}

function loadFromSetupJson() {
  const path = join(PROJECT_ROOT, ".church-setup.json");
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return {
      name: raw.basic?.name ?? "샘플교회",
      primary: raw.colors?.primaryNavy ?? "#02567D",
      secondary: raw.colors?.secondarySky ?? "#0c9fa5",
      pastorName: raw.pastor?.name ?? "담임목사",
    };
  } catch {
    return null;
  }
}

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function writeSvg(relPath, svg) {
  const abs = join(PROJECT_ROOT, "public/images", relPath);
  ensureDir(abs);
  writeFileSync(abs, svg, "utf8");
  console.log(`[generated] public/images/${relPath}`);
}

function buildLogoSvg(name, primary) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96" width="320" height="96" role="img" aria-label="${escapeXml(name)}">
  <text x="160" y="62" text-anchor="middle"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="44" font-weight="700" fill="${escapeXml(primary)}" letter-spacing="-1">${escapeXml(name)}</text>
</svg>
`;
}

function buildOgImage(name, primary, secondary) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeXml(primary)}"/>
      <stop offset="100%" stop-color="${escapeXml(secondary)}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="335" text-anchor="middle"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="120" font-weight="700" fill="#ffffff" letter-spacing="-2">${escapeXml(name)}</text>
</svg>
`;
}

function buildPastorPlaceholder(pastorName, primary) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600" width="480" height="600">
  <rect width="480" height="600" fill="#f1f5f9"/>
  <circle cx="240" cy="220" r="100" fill="${escapeXml(primary)}" opacity="0.18"/>
  <path d="M240 240 C 195 240, 160 280, 160 340 L 160 480 L 320 480 L 320 340 C 320 280, 285 240, 240 240 Z"
    fill="${escapeXml(primary)}" opacity="0.18"/>
  <text x="240" y="540" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="22" font-weight="600" fill="#475569">${escapeXml(pastorName)}</text>
  <text x="240" y="572" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="14" fill="#94a3b8">사진을 admin/settings에서 업로드하세요</text>
</svg>
`;
}

function buildVisionPlaceholder(name, primary, secondary) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 781" width="1280" height="781">
  <defs>
    <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeXml(primary)}"/>
      <stop offset="100%" stop-color="${escapeXml(secondary)}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="781" fill="url(#vg)"/>
  <text x="640" y="380" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="80" font-weight="700" fill="#ffffff" letter-spacing="-2">${escapeXml(name)}</text>
  <text x="640" y="440" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="28" fill="#ffffff" opacity="0.85">교회 비전</text>
</svg>
`;
}

function buildHeroPlaceholder(index, name, primary, secondary) {
  const labels = ["환영합니다", "함께 예배합니다", "함께 자라갑니다"];
  const label = labels[index - 1] ?? "환영합니다";
  // 슬라이드별 색상 변형
  const variants = [
    [primary, secondary],
    [secondary, primary],
    [primary, "#1e3a5f"],
  ];
  const [c1, c2] = variants[index - 1] ?? variants[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="h${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeXml(c1)}"/>
      <stop offset="100%" stop-color="${escapeXml(c2)}"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#h${index})"/>
  <text x="960" y="520" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="120" font-weight="700" fill="#ffffff" letter-spacing="-2">${escapeXml(name)}</text>
  <text x="960" y="620" text-anchor="middle"
    font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
    font-size="56" fill="#ffffff" opacity="0.9">${escapeXml(label)}</text>
</svg>
`;
}

function buildFavicon(primary) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="${escapeXml(primary)}"/>
  <path d="M14 8 L18 8 L18 14 L24 14 L24 18 L18 18 L18 24 L14 24 L14 18 L8 18 L8 14 L14 14 Z" fill="#ffffff"/>
</svg>
`;
}

const args = parseArgs(process.argv.slice(2));
const setupData = loadFromSetupJson();

const config = {
  name: args.name || setupData?.name || "샘플교회",
  primary: args.primary || setupData?.primary || "#02567D",
  secondary: args.secondary || setupData?.secondary || "#0c9fa5",
  pastorName: args.pastorName || setupData?.pastorName || "담임목사",
};

console.log("[config]", config);

writeSvg("logo.svg", buildLogoSvg(config.name, config.primary));
writeSvg("og-image.svg", buildOgImage(config.name, config.primary, config.secondary));
writeSvg("pastor-placeholder.svg", buildPastorPlaceholder(config.pastorName, config.primary));
writeSvg("vision-placeholder.svg", buildVisionPlaceholder(config.name, config.primary, config.secondary));
writeSvg("hero/hero-1-placeholder.svg", buildHeroPlaceholder(1, config.name, config.primary, config.secondary));
writeSvg("hero/hero-2-placeholder.svg", buildHeroPlaceholder(2, config.name, config.primary, config.secondary));
writeSvg("hero/hero-3-placeholder.svg", buildHeroPlaceholder(3, config.name, config.primary, config.secondary));

// favicon은 public 루트
const faviconPath = join(PROJECT_ROOT, "public/favicon.svg");
ensureDir(faviconPath);
writeFileSync(faviconPath, buildFavicon(config.primary), "utf8");
console.log("[generated] public/favicon.svg");

console.log("\n✅ Placeholder 8개 생성 완료. admin에서 실제 이미지로 교체하세요.");

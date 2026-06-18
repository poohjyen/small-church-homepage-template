#!/usr/bin/env node
/**
 * .church-setup.json을 읽어서 site_settings UPSERT SQL을 생성.
 * 산출물: supabase/seed/site_settings.generated.sql
 *
 * setup-church Skill의 Phase 2-D (또는 Phase 3 마지막)에서
 * mcp__supabase__execute_sql로 이 파일 내용을 실행합니다.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../../../..");
const SETUP_PATH = join(PROJECT_ROOT, ".church-setup.json");
const OUT_PATH = join(PROJECT_ROOT, "supabase/seed/site_settings.generated.sql");

if (!existsSync(SETUP_PATH)) {
  console.error("❌ .church-setup.json이 없습니다.");
  process.exit(1);
}

const setup = JSON.parse(readFileSync(SETUP_PATH, "utf8"));

const basic = setup.basic || {};
const pastor = setup.pastor || {};
const vision = setup.vision || {};
const worship = setup.worship || { items: [] };
const contact = setup.contact || {};
const offering = setup.offering || { items: [] };
const sns = setup.sns || {};
const sections = setup.sections || [
  "greeting", "vision", "worship", "featured-sermon", "sermons-quad",
  "quick-actions", "gallery-strip", "online-giving", "location",
];

// SQL injection 방지 — JSON 문자열을 안전하게 escape
function jsonbValue(obj) {
  // PostgreSQL `'...'::jsonb` 안에 들어갈 문자열로
  // 작은따옴표는 SQL standard로 두 번
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

function jsonbString(s) {
  return jsonbValue(s);
}

const yearMotto = {
  year: vision.year || new Date().getFullYear(),
  motto: vision.motto || "",
  scripture: vision.scripture || "",
  body: vision.body || "",
};

const visionThree = {
  v1: vision.v1 || "",
  v2: vision.v2 || "",
  v3: vision.v3 || "",
};

const contactObj = {
  address: contact.address || "",
  phone: contact.phone || "",
  account: contact.account || (offering.items?.[0]?.account ?? ""),
};

const snsObj = {
  band: sns.band || "",
  youtube: sns.youtube || "",
  instagram: sns.instagram || "",
};

const offeringObj = { items: offering.items || [] };
const worshipObj = { items: worship.items || [] };
const landingSections = {
  items: [
    "greeting", "vision", "worship", "featured-sermon", "sermons-quad",
    "quick-actions", "gallery-strip", "online-giving", "mission-card", "location",
  ].map((key) => ({
    key,
    visible: sections.includes(key),
  })),
};

const pastorGreeting = {
  name: pastor.name || "",
  photo_url: "",
  body: pastor.greeting || "",
};

const adminName =
  (pastor.name || "").replace(/\s*목사\s*$/, "") || basic.adminName || "";

const upserts = [
  ["year_motto", jsonbValue(yearMotto)],
  ["vision_three", jsonbValue(visionThree)],
  ["contact", jsonbValue(contactObj)],
  ["sns", jsonbValue(snsObj)],
  ["offering_accounts", jsonbValue(offeringObj)],
  ["worship_schedules", jsonbValue(worshipObj)],
  ["landing_sections", jsonbValue(landingSections)],
  ["pastor_greeting", jsonbValue(pastorGreeting)],
];

if (adminName) upserts.push(["admin_name", jsonbString(adminName)]);

const sql = `-- 자동 생성됨: build-seed-sql.mjs (${new Date().toISOString()})
-- setup-church Skill이 mcp__supabase__execute_sql로 실행합니다.
-- 또는 Supabase Dashboard → SQL Editor에서 직접 실행 가능.

${upserts
  .map(
    ([key, value]) =>
      `insert into site_settings (key, value) values ('${key}', ${value})
on conflict (key) do update set value = excluded.value, updated_at = now();`,
  )
  .join("\n\n")}
`;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, sql, "utf8");
console.log(`✓ ${OUT_PATH.replace(PROJECT_ROOT, ".")}`);
console.log(`  ${upserts.length}개 site_settings UPSERT 생성`);

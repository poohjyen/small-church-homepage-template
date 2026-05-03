import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!URL || !ANON || !SERVICE) {
  console.error("[FAIL] env 누락:", {
    NEXT_PUBLIC_SUPABASE_URL: !!URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!ANON,
    SUPABASE_SERVICE_ROLE_KEY: !!SERVICE,
  });
  process.exit(1);
}

const anon = createClient(URL, ANON);
const admin = createClient(URL, SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const REQUIRED_TABLES = [
  "notices",
  "sermons",
  "pastoral_columns",
  "bulletins",
  "galleries",
  "gallery_images",
  "resources",
  "newcomer_forms",
  "prayer_requests",
  "visit_requests",
  "site_settings",
  "hero_slides",
  "videos",
];

const REQUIRED_BUCKETS = ["bulletins", "gallery", "resources", "hero", "site"];

let pass = 0;
let fail = 0;
function ok(label: string, extra = "") {
  pass++;
  console.log(`  ✓ ${label}${extra ? " — " + extra : ""}`);
}
function bad(label: string, err: unknown) {
  fail++;
  const msg = err instanceof Error ? err.message : JSON.stringify(err);
  console.log(`  ✗ ${label} — ${msg}`);
}

async function main() {
  console.log("\n[1] 공개 읽기 (anon) — 12개 테이블");
  for (const t of REQUIRED_TABLES) {
    const { error } = await anon.from(t).select("*", { head: true, count: "exact" }).limit(1);
    if (error) bad(t, error.message);
    else ok(t);
  }

  console.log("\n[2] site_settings 초기 데이터 6개");
  const { data: settings, error: sErr } = await anon
    .from("site_settings")
    .select("key");
  if (sErr) bad("site_settings select", sErr.message);
  else {
    const keys = new Set((settings ?? []).map((r) => r.key));
    for (const k of ["year_motto", "vision_three", "month_motto", "contact", "sns", "admin_email"]) {
      keys.has(k) ? ok(k) : bad(k, "missing");
    }
  }

  console.log("\n[3] 관리자 쓰기 (service_role) — notices insert/delete");
  const probeTitle = "__connection_probe_" + Date.now();
  const { data: ins, error: insErr } = await admin
    .from("notices")
    .insert({ title: probeTitle, content: "probe" })
    .select("id")
    .single();
  if (insErr || !ins) bad("notices insert", insErr ?? "no row");
  else {
    ok("notices insert", ins.id);
    const { error: delErr } = await admin.from("notices").delete().eq("id", ins.id);
    if (delErr) bad("notices delete", delErr.message);
    else ok("notices delete");
  }

  console.log("\n[4] anon으로 notices INSERT 시도 (RLS로 차단되어야 함)");
  const { error: anonInsErr } = await anon
    .from("notices")
    .insert({ title: "should_fail", content: "x" });
  if (anonInsErr) ok("RLS block anon insert", anonInsErr.message.slice(0, 60));
  else bad("RLS block anon insert", "차단되어야 하는데 통과됨 — 정책 점검 필요");

  console.log("\n[5] anon 폼 INSERT (newcomer/prayer/visit) — 허용 + SELECT 차단");
  // RLS 설계: anon은 INSERT만 가능, SELECT 불가 → .select() 체이닝하면 안 됨
  for (const t of ["newcomer_forms", "prayer_requests", "visit_requests"]) {
    const row =
      t === "newcomer_forms"
        ? { name: "__probe_anon", phone: "000" }
        : t === "prayer_requests"
          ? { content: "__probe_anon", is_anonymous: true }
          : { name: "__probe_anon", phone: "000", address: "__probe" };
    const { error: e, status } = await anon.from(t).insert(row);
    if (e) bad(`${t} anon insert`, e.message);
    else ok(`${t} anon insert`, `HTTP ${status}`);
  }
  // 흔적 정리
  for (const t of ["newcomer_forms", "prayer_requests", "visit_requests"]) {
    await admin
      .from(t)
      .delete()
      .or("name.like.__probe%,content.like.__probe%");
  }

  console.log("\n[6] Storage 버킷 5개 존재 확인");
  const { data: buckets, error: bErr } = await admin.storage.listBuckets();
  if (bErr) bad("listBuckets", bErr.message);
  else {
    const names = new Set((buckets ?? []).map((b) => b.name));
    for (const b of REQUIRED_BUCKETS) {
      if (names.has(b)) ok(`bucket: ${b}`);
      else bad(`bucket: ${b}`, "missing");
    }
  }

  console.log("\n[7] 관리자 계정 (poohjyen@gmail.com) 존재 확인");
  const { data: users, error: uErr } = await admin.auth.admin.listUsers();
  if (uErr) bad("listUsers", uErr.message);
  else {
    const u = users.users.find((x) => x.email === "poohjyen@gmail.com");
    if (u) ok("admin user", u.email_confirmed_at ? "confirmed" : "NOT confirmed");
    else bad("admin user", "poohjyen@gmail.com 없음 — Authentication → Users에서 추가 필요");
  }

  console.log(`\n=== 결과: ${pass} pass / ${fail} fail ===`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("[unexpected]", e);
  process.exit(1);
});

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(URL, SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABLES = ["newcomer_forms", "prayer_requests", "visit_requests"];

const sql = `
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = any($1)
order by tablename, cmd, policyname;
`;

const { data, error } = await admin.rpc("exec_sql", { q: sql, args: [TABLES] }).maybeSingle();
if (error || !data) {
  console.log("[fallback] exec_sql RPC 없음 — 직접 select으로 시도");
  const { data: rows, error: e2 } = await admin
    .from("pg_policies" as never)
    .select("tablename, policyname, cmd, roles, qual, with_check")
    .in("tablename", TABLES);
  if (e2) {
    console.error("FAIL:", e2);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(JSON.stringify(data, null, 2));
}

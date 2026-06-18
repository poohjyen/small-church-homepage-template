import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TRASH_DOMAINS, TRASH_RETENTION_DAYS } from "./domains";
import { purgeExpired } from "./actions";
import { TrashTable, type TrashRow } from "./TrashTable";

export const metadata = { title: "휴지통" };
export const dynamic = "force-dynamic";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function collectTrashRows(
  supabase: SupabaseServerClient,
): Promise<TrashRow[]> {
  const nowMs = Date.now();
  const rows: TrashRow[] = [];
  for (const d of TRASH_DOMAINS) {
    const { data } = await (supabase as unknown as {
      from: (t: string) => {
        select: (cols: string) => {
          not: (
            col: string,
            op: string,
            v: unknown,
          ) => {
            order: (col: string, opts: unknown) => Promise<{
              data: Record<string, unknown>[] | null;
            }>;
          };
        };
      };
    })
      .from(d.table)
      .select(`id, ${d.titleField}, deleted_at`)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    if (!data) continue;
    for (const r of data) {
      const id = String(r.id ?? "");
      const title = String(r[d.titleField] ?? "");
      const deletedAt = String(r.deleted_at ?? "");
      if (!id || !deletedAt) continue;
      const elapsedMs = nowMs - new Date(deletedAt).getTime();
      const daysLeft = Math.max(
        0,
        Math.ceil(
          (TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000 - elapsedMs) /
            (24 * 60 * 60 * 1000),
        ),
      );
      rows.push({
        domainKey: d.key,
        domainLabel: d.label,
        id,
        title,
        deletedAt,
        daysLeft,
      });
    }
  }
  rows.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
  return rows;
}

export default async function TrashPage() {
  await purgeExpired();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="p-6 text-sm text-red-600">관리자 권한이 필요합니다.</div>
    );
  }

  const rows = await collectTrashRows(supabase);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-charcoal">
          <Trash2 className="size-6 text-warm-gray" aria-hidden /> 휴지통
        </h1>
        <p className="mt-1 text-sm text-warm-gray">
          삭제된 항목은 {TRASH_RETENTION_DAYS}일 동안 보관되며, 이 페이지를 열 때마다 기간이 지난 항목이 영구 삭제됩니다.
          복원하면 원래 위치로 돌아갑니다. — 총 {rows.length}건
        </p>
      </div>

      <TrashTable rows={rows} />
    </div>
  );
}

import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllPopups, classifyPopup } from "@/lib/data/popups";
import { deletePopup } from "./actions";

export const metadata = { title: "팝업 관리" };

const POSITION_KO: Record<string, string> = {
  center: "중앙",
  "top-right": "우측상단",
  "bottom-right": "우측하단",
  "top-left": "좌측상단",
  "bottom-left": "좌측하단",
};

export default async function AdminPopupsPage() {
  const all = await getAllPopups();
  const now = new Date();
  const grouped = {
    active: all.filter((p) => classifyPopup(p, now) === "active"),
    scheduled: all.filter((p) => classifyPopup(p, now) === "scheduled"),
    ended: all.filter((p) => classifyPopup(p, now) === "ended"),
  };

  return (
    <div>
      <AdminPageHeader
        title="팝업 관리"
        description={`전체 ${all.length}건 — 노출 중 ${grouped.active.length} · 예정 ${grouped.scheduled.length} · 종료/비활성 ${grouped.ended.length}`}
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/popups/new">
                <Plus className="size-4" aria-hidden />
                새 팝업 만들기
              </Link>
            }
          />
        }
      />

      {all.length === 0 ? (
        <AdminEmptyState
          message="등록된 팝업이 없습니다."
          hint="우측 상단 [새 팝업 만들기]에서 첫 팝업을 등록하세요."
        />
      ) : (
        <div className="space-y-8">
          <PopupGroup label="🟢 노출 중" rows={grouped.active} />
          <PopupGroup label="🟡 예정" rows={grouped.scheduled} />
          <PopupGroup label="🔴 종료 / 비활성" rows={grouped.ended} />
        </div>
      )}
    </div>
  );
}

function PopupGroup({
  label,
  rows,
}: {
  label: string;
  rows: Awaited<ReturnType<typeof getAllPopups>>;
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-warm-gray">
        {label} ({rows.length})
      </h2>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 px-4">미리보기</TableHead>
              <TableHead className="px-4">제목 / 위치</TableHead>
              <TableHead className="w-44 px-4">노출 기간</TableHead>
              <TableHead className="w-20 px-4 text-right">우선순위</TableHead>
              <TableHead className="w-32 px-4 text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt=""
                    className="size-12 rounded object-contain bg-slate-50 ring-1 ring-black/5"
                  />
                </TableCell>
                <TableCell className="max-w-[420px] truncate px-4">
                  <Link
                    href={`/admin/popups/${p.id}/edit`}
                    className="font-medium text-charcoal hover:text-primary-navy hover:underline"
                  >
                    {p.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="border-slate-300 text-xs">
                      {POSITION_KO[p.position] ?? p.position}
                    </Badge>
                    {!p.is_active && (
                      <Badge variant="outline" className="border-red-300 text-red-600 text-xs">
                        비활성
                      </Badge>
                    )}
                    {p.link_url ? (
                      <Link
                        href={p.link_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-0.5 text-xs text-warm-gray hover:text-primary-navy"
                      >
                        링크 <ExternalLink className="size-3" />
                      </Link>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-4 text-xs text-warm-gray">
                  {format(parseISO(p.starts_at), "yy.MM.dd HH:mm")}
                  <br />
                  ↓ {format(parseISO(p.ends_at), "yy.MM.dd HH:mm")}
                </TableCell>
                <TableCell className="px-4 text-right tabular-nums text-warm-gray">
                  {p.display_priority}
                </TableCell>
                <TableCell className="px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-warm-gray hover:text-primary-navy"
                      render={
                        <Link href={`/admin/popups/${p.id}/edit`}>
                          <Pencil className="size-4" aria-hidden />
                          <span className="sr-only">수정</span>
                        </Link>
                      }
                    />
                    <DeleteButton
                      itemLabel={p.title}
                      iconOnly
                      action={deletePopup.bind(null, p.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

import { format, parseISO } from "date-fns";
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
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getVisitRequests } from "@/lib/data/forms";
import { SubmissionDetailSheet } from "../SubmissionDetailSheet";

export const metadata = { title: "심방 요청 관리" };

export default async function VisitSubmissionsPage() {
  const rows = await getVisitRequests();

  return (
    <div>
      <AdminPageHeader
        title="심방 요청"
        description={`총 ${rows.length}건 · 새 접수 ${rows.filter((r) => r.status === "new").length}건`}
      />

      {rows.length === 0 ? (
        <AdminEmptyState message="접수된 심방 요청이 없습니다." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">신청자</TableHead>
                <TableHead className="px-4">주소 / 사유</TableHead>
                <TableHead className="px-4">희망 일시</TableHead>
                <TableHead className="w-32 px-4">접수일</TableHead>
                <TableHead className="w-28 px-4 text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <SubmissionDetailSheet
                  key={r.id}
                  type="visit"
                  row={r}
                  trigger={
                    <TableRow className="cursor-pointer transition hover:bg-soft">
                      <TableCell className="px-4 align-top">
                        <p className="font-medium text-charcoal">{r.name}</p>
                        <p className="mt-0.5 text-xs text-warm-gray">{r.phone}</p>
                      </TableCell>
                      <TableCell className="max-w-[360px] px-4 align-top">
                        <p className="text-sm text-charcoal">{r.address}</p>
                        {r.reason ? (
                          <p className="mt-1 line-clamp-1 text-xs text-warm-gray">
                            {r.reason}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-4 align-top text-warm-gray">
                        {r.requested_date
                          ? `${format(parseISO(r.requested_date), "yyyy.MM.dd")}${r.requested_time ? ` ${r.requested_time}` : ""}`
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4 align-top text-warm-gray">
                        {format(parseISO(r.created_at), "yyyy.MM.dd HH:mm")}
                      </TableCell>
                      <TableCell className="px-4 text-right align-top">
                        <StatusBadge status={r.status} />
                      </TableCell>
                    </TableRow>
                  }
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

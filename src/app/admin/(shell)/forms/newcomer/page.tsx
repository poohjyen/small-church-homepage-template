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
import { getNewcomerForms } from "@/lib/data/forms";
import { SubmissionDetailSheet } from "../SubmissionDetailSheet";

export const metadata = { title: "새가족 신청 관리" };

export default async function NewcomerSubmissionsPage() {
  const rows = await getNewcomerForms();

  return (
    <div>
      <AdminPageHeader
        title="새가족 신청"
        description={`총 ${rows.length}건 · 새 접수 ${rows.filter((r) => r.status === "new").length}건`}
      />

      {rows.length === 0 ? (
        <AdminEmptyState message="접수된 신청이 없습니다." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">신청자</TableHead>
                <TableHead className="px-4">연락처</TableHead>
                <TableHead className="px-4">방문 계기</TableHead>
                <TableHead className="w-32 px-4">접수일</TableHead>
                <TableHead className="w-28 px-4 text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <SubmissionDetailSheet
                  key={r.id}
                  type="newcomer"
                  row={r}
                  trigger={
                    <TableRow className="cursor-pointer transition hover:bg-soft">
                      <TableCell className="px-4 align-top">
                        <p className="font-medium text-charcoal">{r.name}</p>
                        {r.address ? (
                          <p className="mt-0.5 text-xs text-warm-gray">
                            {r.address}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-4 align-top text-warm-gray">
                        {r.phone}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate px-4 align-top text-warm-gray">
                        {r.visit_reason ?? "—"}
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

import { format, parseISO } from "date-fns";
import { EyeOff } from "lucide-react";
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
import { getPrayerRequests } from "@/lib/data/forms";
import { SubmissionDetailSheet } from "../SubmissionDetailSheet";

export const metadata = { title: "기도제목 관리" };

export default async function PrayerSubmissionsPage() {
  const rows = await getPrayerRequests();

  return (
    <div>
      <AdminPageHeader
        title="기도제목"
        description={`총 ${rows.length}건 · 새 접수 ${rows.filter((r) => r.status === "new").length}건 · 익명 ${rows.filter((r) => r.is_anonymous).length}건`}
      />

      {rows.length === 0 ? (
        <AdminEmptyState message="접수된 기도제목이 없습니다." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">신청자</TableHead>
                <TableHead className="px-4">기도제목</TableHead>
                <TableHead className="w-32 px-4">접수일</TableHead>
                <TableHead className="w-28 px-4 text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <SubmissionDetailSheet
                  key={r.id}
                  type="prayer"
                  row={r}
                  trigger={
                    <TableRow className="cursor-pointer transition hover:bg-soft">
                      <TableCell className="px-4 align-top">
                        {r.is_anonymous ? (
                          <span className="inline-flex items-center gap-1 text-warm-gray">
                            <EyeOff className="size-3.5" aria-hidden />
                            익명
                          </span>
                        ) : (
                          <div>
                            <p className="font-medium text-charcoal">{r.name}</p>
                            {r.phone ? (
                              <p className="mt-0.5 text-xs text-warm-gray">
                                {r.phone}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[440px] px-4 align-top">
                        <p className="line-clamp-2 text-sm text-charcoal">
                          {r.content}
                        </p>
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

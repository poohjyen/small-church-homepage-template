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
import { getDonationReceipts } from "@/lib/data/forms";
import type { DonationDeliveryMethod } from "@/types/database";
import { SubmissionDetailSheet } from "../SubmissionDetailSheet";

export const metadata = { title: "기부금 영수증 신청 관리" };

const DELIVERY_LABEL: Record<DonationDeliveryMethod, string> = {
  pickup: "교회 수령",
  email: "이메일",
  fax: "팩스",
};

export default async function DonationReceiptSubmissionsPage() {
  const rows = await getDonationReceipts();

  return (
    <div>
      <AdminPageHeader
        title="기부금 영수증 신청"
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
                <TableHead className="px-4">주소</TableHead>
                <TableHead className="w-28 px-4">수령방법</TableHead>
                <TableHead className="w-32 px-4">접수일</TableHead>
                <TableHead className="w-28 px-4 text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <SubmissionDetailSheet
                  key={r.id}
                  type="donation-receipt"
                  row={r}
                  trigger={
                    <TableRow className="cursor-pointer transition hover:bg-soft">
                      <TableCell className="px-4 align-top">
                        <p className="font-medium text-charcoal">{r.name}</p>
                        <p className="mt-0.5 text-xs text-warm-gray">{r.phone}</p>
                      </TableCell>
                      <TableCell className="max-w-[360px] px-4 align-top">
                        <p className="text-sm text-charcoal">{r.address}</p>
                      </TableCell>
                      <TableCell className="px-4 align-top text-warm-gray">
                        {DELIVERY_LABEL[r.delivery_method]}
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

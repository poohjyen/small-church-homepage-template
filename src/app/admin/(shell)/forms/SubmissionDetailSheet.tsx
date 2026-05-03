"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FORM_STATUS_LABEL } from "@/lib/data/helpers";
import type {
  FormStatus,
  NewcomerForm,
  PrayerRequest,
  VisitRequest,
} from "@/types/database";

import {
  updateNewcomerSubmission,
  updatePrayerSubmission,
  updateVisitSubmission,
} from "./actions";

type Props =
  | { type: "newcomer"; row: NewcomerForm; trigger: React.ReactElement }
  | { type: "prayer"; row: PrayerRequest; trigger: React.ReactElement }
  | { type: "visit"; row: VisitRequest; trigger: React.ReactElement };

const STATUS_OPTIONS: FormStatus[] = [
  "new",
  "contacted",
  "completed",
  "archived",
];

const TITLES: Record<Props["type"], string> = {
  newcomer: "새가족 신청 상세",
  prayer: "기도제목 상세",
  visit: "심방 요청 상세",
};

const ACTIONS = {
  newcomer: updateNewcomerSubmission,
  prayer: updatePrayerSubmission,
  visit: updateVisitSubmission,
} as const;

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-warm-gray">
        {label}
      </p>
      <p className="whitespace-pre-line break-words text-sm text-charcoal">
        {value || <span className="text-warm-gray">—</span>}
      </p>
    </div>
  );
}

function NewcomerFields({ row }: { row: NewcomerForm }) {
  return (
    <>
      <Field label="이름" value={row.name} />
      <Field label="연락처" value={row.phone} />
      <Field label="생년월일" value={row.birthdate} />
      <Field label="주소" value={row.address} />
      <Field label="가족 관계" value={row.family_info} />
      <Field label="이전 교회" value={row.previous_church} />
      <Field label="방문 계기" value={row.visit_reason} />
    </>
  );
}

function PrayerFields({ row }: { row: PrayerRequest }) {
  return (
    <>
      <Field
        label="신청자"
        value={row.is_anonymous ? "익명" : row.name || "—"}
      />
      {row.is_anonymous ? null : <Field label="연락처" value={row.phone} />}
      <Field label="기도제목" value={row.content} />
    </>
  );
}

function VisitFields({ row }: { row: VisitRequest }) {
  return (
    <>
      <Field label="이름" value={row.name} />
      <Field label="연락처" value={row.phone} />
      <Field label="주소" value={row.address} />
      <Field
        label="희망 일시"
        value={
          row.requested_date
            ? `${row.requested_date}${row.requested_time ? ` ${row.requested_time}` : ""}`
            : "—"
        }
      />
      <Field label="심방 사유" value={row.reason} />
    </>
  );
}

export function SubmissionDetailSheet(props: Props) {
  const { type, row, trigger } = props;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>(row.status);
  const [memo, setMemo] = useState(row.admin_memo ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSave() {
    startTransition(async () => {
      const result = await ACTIONS[type]({
        id: row.id,
        status,
        admin_memo: memo,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("저장되었습니다.");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader className="border-b border-black/5">
          <SheetTitle>{TITLES[type]}</SheetTitle>
          <SheetDescription>
            접수일 {format(parseISO(row.created_at), "yyyy.MM.dd HH:mm")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {type === "newcomer" ? <NewcomerFields row={row} /> : null}
          {type === "prayer" ? <PrayerFields row={row} /> : null}
          {type === "visit" ? <VisitFields row={row} /> : null}

          <div className="space-y-2 border-t border-black/5 pt-4">
            <Label htmlFor="status">처리 상태</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as FormStatus)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {FORM_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">관리 메모</Label>
            <Textarea
              id="memo"
              rows={6}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="연락 일자, 진행 상황 등 내부 메모를 남겨주세요."
            />
          </div>
        </div>

        <SheetFooter className="border-t border-black/5">
          <Button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="bg-primary-navy text-white hover:bg-secondary-sky"
          >
            <Save className="size-4" aria-hidden />
            {pending ? "저장 중..." : "저장"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

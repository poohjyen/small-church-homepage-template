"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminNoticeSchema,
  NOTICE_CATEGORY_OPTIONS,
  type AdminNoticeInput,
} from "@/lib/forms/admin-schemas";
import type { Notice, NoticeCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { useUnsavedWarning } from "@/lib/hooks/useUnsavedWarning";
import { createNotice, updateNotice } from "./actions";

export function NoticeForm({
  initial,
  defaultCategory = "news",
}: {
  initial?: Notice;
  defaultCategory?: NoticeCategory;
}) {
  const router = useRouter();
  const isEdit = !!initial;

  const form = useForm<AdminNoticeInput>({
    resolver: standardSchemaResolver(adminNoticeSchema),
    defaultValues: {
      title: initial?.title ?? "",
      content: initial?.content ?? "",
      is_pinned: initial?.is_pinned ?? false,
      category: initial?.category ?? defaultCategory,
    },
  });

  useUnsavedWarning(
    form.formState.isDirty &&
      !form.formState.isSubmitting &&
      !form.formState.isSubmitSuccessful,
  );

  async function onSubmit(values: AdminNoticeInput) {
    const result = isEdit
      ? await updateNotice(initial!.id, values)
      : await createNotice(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "수정되었습니다." : "발행되었습니다.");
    const target =
      values.category === "schedule" ? "/admin/schedules" : "/admin/notices";
    router.push(target);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                분류 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {NOTICE_CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition",
                        field.value === opt.value
                          ? "border-primary-navy bg-primary-navy text-white"
                          : "border-slate-300 bg-white text-charcoal hover:border-primary-navy/40",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <p className="mt-1 text-xs text-warm-gray">
                교회소식은 <code>/notices</code>, 교회일정은 <code>/schedules</code> 메뉴에 표시됩니다.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                제목 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="공지사항 제목" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                본문 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={14}
                  placeholder="줄바꿈은 본문에 그대로 표시됩니다."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_pinned"
          render={({ field }) => (
            <FormItem className="rounded-xl bg-soft p-4 ring-1 ring-black/5">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(c) => field.onChange(c === true)}
                  />
                </FormControl>
                <div className="-mt-0.5">
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
                    <Pin className="size-4 text-primary-navy" aria-hidden />
                    상단 고정
                  </FormLabel>
                  <p className="mt-1 text-xs text-warm-gray">
                    중요한 공지일 경우 체크하세요. 목록 상단에 우선 표시됩니다.
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "저장 중..."
              : isEdit
                ? "수정 발행"
                : "발행"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileEdit } from "lucide-react";
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
  adminColumnSchema,
  type AdminColumnInput,
} from "@/lib/forms/admin-schemas";
import type { PastoralColumn } from "@/types/database";
import { useUnsavedWarning } from "@/lib/hooks/useUnsavedWarning";
import { createColumn, updateColumn } from "./actions";

export function ColumnForm({ initial }: { initial?: PastoralColumn }) {
  const router = useRouter();
  const isEdit = !!initial;

  const form = useForm<AdminColumnInput>({
    resolver: standardSchemaResolver(adminColumnSchema),
    defaultValues: {
      title: initial?.title ?? "",
      author: initial?.author ?? "",
      published_date: initial?.published_date ?? format(new Date(), "yyyy-MM-dd"),
      content: initial?.content ?? "",
      is_draft: initial?.is_draft ?? false,
    },
  });

  useUnsavedWarning(
    form.formState.isDirty &&
      !form.formState.isSubmitting &&
      !form.formState.isSubmitSuccessful,
  );

  async function onSubmit(values: AdminColumnInput) {
    const result = isEdit
      ? await updateColumn(initial!.id, values)
      : await createColumn(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "수정되었습니다." : "발행되었습니다.");
    router.push("/admin/columns");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  제목 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="목양칼럼 제목" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  발행일 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                작성자 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="저자 이름" {...field} />
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
                  rows={16}
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
          name="is_draft"
          render={({ field }) => (
            <FormItem className="rounded-xl bg-soft p-4 ring-1 ring-black/5">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={(c) => field.onChange(c === true)}
                  />
                </FormControl>
                <div className="-mt-0.5">
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
                    <FileEdit className="size-4 text-primary-navy" aria-hidden />
                    임시저장(초안)
                  </FormLabel>
                  <p className="mt-1 text-xs text-warm-gray">
                    체크하면 초안으로 저장되어 공개 페이지에 노출되지 않습니다.
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

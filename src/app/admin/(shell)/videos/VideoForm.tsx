"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { format } from "date-fns";
import { Film, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminVideoSchema,
  type AdminVideoInput,
  extractYoutubeId,
} from "@/lib/forms/admin-schemas";
import { youtubeThumb } from "@/lib/data/helpers";
import type { Video } from "@/types/database";
import { useUnsavedWarning } from "@/lib/hooks/useUnsavedWarning";
import { createVideo, updateVideo } from "./actions";

export function VideoForm({ initial }: { initial?: Video }) {
  const router = useRouter();
  const isEdit = !!initial;

  const form = useForm<AdminVideoInput>({
    resolver: standardSchemaResolver(adminVideoSchema),
    defaultValues: {
      title: initial?.title ?? "",
      performer: initial?.performer ?? "",
      youtube_url: initial?.youtube_id ?? "",
      description: initial?.description ?? "",
      video_date: initial?.video_date ?? format(new Date(), "yyyy-MM-dd"),
    },
  });

  useUnsavedWarning(
    form.formState.isDirty &&
      !form.formState.isSubmitting &&
      !form.formState.isSubmitSuccessful,
  );

  const youtubeRaw = form.watch("youtube_url");
  const youtubeId = extractYoutubeId(youtubeRaw ?? "");

  async function onSubmit(values: AdminVideoInput) {
    const result = isEdit
      ? await updateVideo(initial!.id, values)
      : await createVideo(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "수정되었습니다." : "등록되었습니다.");
    router.push("/admin/videos");
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
                  영상 제목 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="예: 주님의 사랑 - 찬양대" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="video_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  게시일 <span className="text-red-500">*</span>
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
          name="performer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>출연자 / 팀</FormLabel>
              <FormControl>
                <Input placeholder="예: 시온찬양대 / 청년부" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtube_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                유튜브 URL 또는 ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://youtu.be/SLP33ddD6CA 또는 SLP33ddD6CA"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-warm-gray">
                <Film
                  className="mr-1 inline-block size-3.5 align-text-bottom"
                  aria-hidden
                />
                youtu.be / youtube.com/watch / shorts / embed URL 모두 지원합니다.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-xl bg-soft p-4 ring-1 ring-black/5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-warm-gray">
            썸네일 미리보기
          </p>
          {youtubeId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={youtubeThumb(youtubeId, "hq")}
              alt="유튜브 썸네일 미리보기"
              className="aspect-video w-full max-w-md rounded-lg object-cover ring-1 ring-black/5"
            />
          ) : (
            <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg bg-white text-warm-gray ring-1 ring-black/5">
              <div className="flex flex-col items-center gap-2">
                <ImageOff className="size-6" aria-hidden />
                <p className="text-xs">유효한 유튜브 URL/ID 입력 시 미리보기가 표시됩니다.</p>
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택)</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="영상 소개 글을 적어주시면 상세 페이지에 표시됩니다."
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                : "등록"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

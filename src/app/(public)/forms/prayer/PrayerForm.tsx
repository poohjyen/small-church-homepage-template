"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { CheckCircle2, EyeOff } from "lucide-react";
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
import { prayerSchema, type PrayerInput } from "@/lib/forms/schemas";
import { submitPrayer } from "./actions";

export function PrayerForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<PrayerInput>({
    resolver: standardSchemaResolver(prayerSchema),
    defaultValues: {
      is_anonymous: false,
      name: "",
      phone: "",
      content: "",
      consent: false,
    },
  });

  const isAnonymous = form.watch("is_anonymous");

  async function onSubmit(values: PrayerInput) {
    const payload = values.is_anonymous
      ? { ...values, name: "", phone: "" }
      : values;
    const result = await submitPrayer(payload);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("기도제목이 접수되었습니다.");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2
          className="size-16 text-accent-coral"
          strokeWidth={1.5}
          aria-hidden
        />
        <h2 className="mt-6 text-2xl font-bold text-charcoal">
          기도제목이 접수되었습니다.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-warm-gray">
          담임목사님과 중보기도팀이 함께 마음을 모아 기도드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem className="rounded-xl bg-primary-navy/5 p-4 ring-1 ring-primary-navy/15">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                      if (checked === true) {
                        form.setValue("name", "");
                        form.setValue("phone", "");
                        form.clearErrors(["name", "phone"]);
                      }
                    }}
                  />
                </FormControl>
                <div className="-mt-0.5">
                  <FormLabel className="flex items-center gap-1.5 text-[15px] font-semibold text-primary-navy">
                    <EyeOff className="size-4" aria-hidden /> 익명으로 보내기
                  </FormLabel>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-warm-gray">
                    체크 시 이름·연락처 없이 기도제목만 전달됩니다.
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성함 {isAnonymous ? null : <span className="text-red-500">*</span>}</FormLabel>
              <FormControl>
                <Input
                  placeholder={isAnonymous ? "익명" : "홍길동"}
                  disabled={isAnonymous}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder={isAnonymous ? "-" : "010-1234-5678 (선택)"}
                  disabled={isAnonymous}
                  {...field}
                />
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
                기도제목 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="함께 기도해 주시면 좋겠는 내용을 적어주세요."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="rounded-xl bg-soft p-4 ring-1 ring-black/5">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <div className="-mt-0.5">
                  <FormLabel className="text-[15px] font-medium text-charcoal">
                    개인정보 수집·이용에 동의합니다.{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-warm-gray">
                    익명 선택 시 어떠한 개인정보도 수집되지 않습니다. ·{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-sky underline-offset-2 hover:underline"
                    >
                      자세히 보기
                    </Link>
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary-navy text-white hover:bg-secondary-sky"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "제출 중..." : "기도제목 보내기"}
        </Button>
      </form>
    </Form>
  );
}

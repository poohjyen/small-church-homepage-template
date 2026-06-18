"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
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
import { visitSchema, type VisitInput } from "@/lib/forms/schemas";
import { TurnstileWidget } from "@/components/public/TurnstileWidget";
import { submitVisit } from "./actions";

export function VisitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const form = useForm<VisitInput>({
    resolver: standardSchemaResolver(visitSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      requested_date: "",
      requested_time: "",
      reason: "",
      consent: false,
    },
  });

  async function onSubmit(values: VisitInput) {
    const result = await submitVisit({ ...values, turnstile_token: token });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("심방 요청이 접수되었습니다.");
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
          심방 요청이 접수되었습니다.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-warm-gray">
          담임목사님이 일정을 확인 후 직접 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                성함 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="홍길동" {...field} />
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
              <FormLabel>
                연락처 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="010-1234-5678"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                주소 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="○○광역시 ○○구 ○○동 (상세주소 포함)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="requested_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>희망 날짜</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requested_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>희망 시간</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>심방 사유</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="간단히 적어주시면 준비에 참고하겠습니다."
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
                    수집 항목: 성함·연락처·주소 / 목적: 심방 일정 조율 / 보유기간: 1년 ·{" "}
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

        <TurnstileWidget onToken={setToken} />

        <Button
          type="submit"
          className="w-full bg-primary-navy text-white hover:bg-secondary-sky"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "제출 중..." : "심방 요청 보내기"}
        </Button>
      </form>
    </Form>
  );
}

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
import { newcomerSchema, type NewcomerInput } from "@/lib/forms/schemas";
import { submitNewcomer } from "./actions";

export function NewcomerForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<NewcomerInput>({
    resolver: standardSchemaResolver(newcomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      birthdate: "",
      address: "",
      family_info: "",
      visit_reason: "",
      previous_church: "",
      consent: false,
    },
  });

  async function onSubmit(values: NewcomerInput) {
    const result = await submitNewcomer(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("등록 신청이 접수되었습니다.");
    setSubmitted(true);
  }

  if (submitted) {
    return <SuccessNotice />;
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
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>생년월일</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>주소</FormLabel>
              <FormControl>
                <Input placeholder="대전광역시 ○○구 ○○동" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="family_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가족관계</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="예) 배우자 김○○ (등록교인), 자녀 1남 1녀"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visit_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>방문 계기 / 전도자</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="예) ○○○ 집사님의 권유로 방문"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previous_church"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이전 출석 교회</FormLabel>
              <FormControl>
                <Input placeholder="없으시면 비워두세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ConsentField control={form.control} />

        <Button
          type="submit"
          className="w-full bg-primary-navy text-white hover:bg-secondary-sky"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "제출 중..." : "등록 신청"}
        </Button>
      </form>
    </Form>
  );
}

function SuccessNotice() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CheckCircle2
        className="size-16 text-accent-coral"
        strokeWidth={1.5}
        aria-hidden
      />
      <h2 className="mt-6 text-2xl font-bold text-charcoal">
        등록 신청이 접수되었습니다.
      </h2>
      <p className="mt-3 text-base leading-relaxed text-warm-gray">
        담당 새가족부에서 빠른 시일 내에 연락드리겠습니다.
      </p>
    </div>
  );
}

import type { Control } from "react-hook-form";

function ConsentField({ control }: { control: Control<NewcomerInput> }) {
  return (
    <FormField
      control={control}
      name="consent"
      render={({ field }) => (
        <FormItem className="rounded-xl bg-soft p-4 ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) =>
                  field.onChange(checked === true)
                }
              />
            </FormControl>
            <div className="-mt-0.5">
              <FormLabel className="text-[15px] font-medium text-charcoal">
                개인정보 수집·이용에 동의합니다.{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <p className="mt-1.5 text-[13px] leading-relaxed text-warm-gray">
                수집 항목: 성함·연락처 등 입력 정보 / 목적: 새가족 등록 및 양육 안내 /
                보유기간: 등록 후 3년 ·{" "}
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
  );
}

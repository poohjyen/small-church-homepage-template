"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import type { Control } from "react-hook-form";

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
import { cn } from "@/lib/utils";
import {
  donationReceiptSchema,
  type DonationReceiptInput,
} from "@/lib/forms/schemas";

import { submitDonationReceipt } from "./actions";

const DELIVERY_OPTIONS: {
  value: DonationReceiptInput["delivery_method"];
  label: string;
}[] = [
  { value: "pickup", label: "교회에서 수령" },
  { value: "email", label: "이메일로 받기" },
  { value: "fax", label: "팩스로 받기" },
];

export function DonationReceiptForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<DonationReceiptInput>({
    resolver: standardSchemaResolver(donationReceiptSchema),
    defaultValues: {
      name: "",
      birthdate: "",
      phone: "",
      address: "",
      delivery_method: "pickup",
      delivery_email: "",
      delivery_fax: "",
      note: "",
      consent: false,
    },
  });

  const deliveryMethod = form.watch("delivery_method");

  async function onSubmit(values: DonationReceiptInput) {
    const result = await submitDonationReceipt(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("기부금 영수증 신청이 접수되었습니다.");
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
          신청이 접수되었습니다.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-warm-gray">
          발급 완료 후 선택하신 방법으로 보내드립니다.
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
                대상자 성명 <span className="text-red-500">*</span>
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
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                생년월일 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
                휴대폰번호 <span className="text-red-500">*</span>
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
                대상자 주소 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="○○시 ○○구 ○○동 (상세주소 포함)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                수령방법 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid gap-2 sm:grid-cols-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const checked = field.value === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm transition",
                          checked
                            ? "border-primary-navy bg-primary-navy/5 text-primary-navy"
                            : "border-slate-200 bg-white text-charcoal hover:border-slate-300",
                        )}
                      >
                        <input
                          type="radio"
                          className="size-4 accent-primary-navy"
                          name={field.name}
                          value={opt.value}
                          checked={checked}
                          onChange={() => {
                            field.onChange(opt.value);
                            if (opt.value !== "email") {
                              form.setValue("delivery_email", "");
                            }
                            if (opt.value !== "fax") {
                              form.setValue("delivery_fax", "");
                            }
                          }}
                        />
                        <span className="font-medium">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {deliveryMethod === "email" ? (
          <FormField
            control={form.control}
            name="delivery_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  이메일 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {deliveryMethod === "fax" ? (
          <FormField
            control={form.control}
            name="delivery_fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  팩스번호 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="02-000-0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>기타요청</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="메일/팩스 수령 시 연락처를 기입해 주세요."
                  {...field}
                />
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
          {form.formState.isSubmitting ? "제출 중..." : "신청하기"}
        </Button>
      </form>
    </Form>
  );
}

function ConsentField({ control }: { control: Control<DonationReceiptInput> }) {
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
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            </FormControl>
            <div className="-mt-0.5">
              <FormLabel className="text-[15px] font-medium text-charcoal">
                개인정보 수집·이용에 동의합니다.{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <p className="mt-1.5 text-[13px] leading-relaxed text-warm-gray">
                수집 항목: 성함·생년월일·연락처·주소·수령정보 / 목적: 기부금
                영수증 발급 / 보유기간: 발급 후 5년 ·{" "}
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

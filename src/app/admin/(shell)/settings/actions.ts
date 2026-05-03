"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  adminEmailSchema,
  adminNameSchema,
  contactSchema,
  dawnPrayersSchema,
  offeringAccountsSchema,
  pageHeroImagesSchema,
  pastorGreetingSchema,
  snsSchema,
  visionThreeSchema,
  worshipSchedulesSchema,
  yearMottoSchema,
} from "@/lib/forms/settings-schemas";

type Result = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

async function upsertSetting(key: string, value: unknown): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: upsertError } = await supabase.from("site_settings").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });
  if (upsertError) return { ok: false, error: upsertError.message };
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function saveYearMotto(input: unknown): Promise<Result> {
  const parsed = yearMottoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  return upsertSetting("year_motto", parsed.data);
}

export async function saveVisionThree(input: unknown): Promise<Result> {
  const parsed = visionThreeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  return upsertSetting("vision_three", parsed.data);
}

export async function saveContact(input: unknown): Promise<Result> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  return upsertSetting("contact", parsed.data);
}

export async function saveSns(input: unknown): Promise<Result> {
  const parsed = snsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  return upsertSetting("sns", parsed.data);
}

export async function saveAdminEmail(input: unknown): Promise<Result> {
  const parsed = adminEmailSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  return upsertSetting("admin_email", parsed.data.admin_email);
}

export async function savePageHeroImages(input: unknown): Promise<Result> {
  const parsed = pageHeroImagesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const cleaned = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v.length > 0),
  );
  const result = await upsertSetting("page_hero_images", cleaned);
  if (result.ok) {
    for (const key of Object.keys(cleaned)) {
      revalidatePath(`/${key}`);
    }
  }
  return result;
}

export async function savePastorGreeting(input: unknown): Promise<Result> {
  const parsed = pastorGreetingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const result = await upsertSetting("pastor_greeting", parsed.data);
  if (result.ok) revalidatePath("/about");
  return result;
}

export async function saveWorshipSchedules(input: unknown): Promise<Result> {
  const parsed = worshipSchedulesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const result = await upsertSetting("worship_schedules", parsed.data);
  if (result.ok) {
    revalidatePath("/about/worship");
    revalidatePath("/");
  }
  return result;
}

export async function saveDawnPrayers(input: unknown): Promise<Result> {
  const parsed = dawnPrayersSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const result = await upsertSetting("dawn_prayers", parsed.data);
  if (result.ok) revalidatePath("/about/worship");
  return result;
}

export async function saveOfferingAccounts(input: unknown): Promise<Result> {
  const parsed = offeringAccountsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const result = await upsertSetting("offering_accounts", parsed.data);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/about/location");
  }
  return result;
}

export async function saveAdminName(input: unknown): Promise<Result> {
  const parsed = adminNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }
  const result = await upsertSetting("admin_name", parsed.data.admin_name);
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/about");
  }
  return result;
}

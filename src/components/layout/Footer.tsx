import Link from "next/link";
import { MapPin, Phone, PlayCircle } from "lucide-react";

import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { NaverBandIcon } from "@/components/icons/NaverBandIcon";

import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { SITE, resolvePastorName } from "@/lib/site";

import { NAV_GROUPS } from "./nav-data";

type Contact = SettingValueMap["contact"];
type Sns = SettingValueMap["sns"];

const EMPTY_CONTACT: Contact = { address: "", phone: "", account: "" };
const EMPTY_SNS: Sns = { band: "", youtube: "", instagram: "" };

/** SITE.address(객체)를 표시용 한 줄 문자열로 합칩니다. 모두 비어 있으면 "". */
function composeAddress(address: typeof SITE.address): string {
  return [
    address.postalCode,
    address.addressRegion,
    address.addressLocality,
    address.streetAddress,
  ]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

export async function Footer() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const contactSetting = (settings.contact as Contact | undefined) ?? EMPTY_CONTACT;
  const sns = (settings.sns as Sns | undefined) ?? EMPTY_SNS;
  const greeting = settings.pastor_greeting as
    | SettingValueMap["pastor_greeting"]
    | undefined;
  const adminName = resolvePastorName(greeting).replace(/\s*목사\s*$/, "");

  const churchName = SITE.name;
  const churchSubtitle = [
    SITE.fullName !== SITE.name ? SITE.fullName : null,
    SITE.founded ? `Since ${SITE.founded}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  // 표시용 주소: 런타임 설정(contact.address) 우선, 없으면 SITE.address 합성 폴백.
  const address = contactSetting.address?.trim() || composeAddress(SITE.address);
  // 표시용 전화: 런타임 설정(contact.phone) 우선, 없으면 SITE.telephone 배열 합성 폴백.
  const phone =
    contactSetting.phone?.trim() || SITE.telephone.filter(Boolean).join(" / ");

  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-navy text-white">
      {/* 모바일 푸터 — 사이트맵 + SNS + 약관 */}
      <div className="container mx-auto px-4 py-4 md:hidden">
        <h2 className="text-center text-base font-bold tracking-tight text-white">
          {churchName}
        </h2>
        {churchSubtitle ? (
          <p className="mt-1 text-center text-xs text-white/60">
            {churchSubtitle}
          </p>
        ) : null}
        <ul className="mt-5 grid grid-cols-3 gap-x-2 gap-y-1.5 text-center">
          {NAV_GROUPS.map((group) => {
            const firstHref = group.children[0]?.href ?? "/";
            return (
              <li key={group.label}>
                <Link
                  href={firstHref}
                  className="inline-flex w-full justify-center px-2 py-2 text-[13px] font-semibold text-white/90 transition active:bg-white/10"
                >
                  {group.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {sns.band || sns.youtube || sns.instagram ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            {sns.band ? (
              <Link
                href={sns.band}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${churchName} 네이버 밴드`}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-[#00C73C] transition active:bg-white/20"
              >
                <NaverBandIcon className="size-5" />
              </Link>
            ) : null}
            {sns.youtube ? (
              <Link
                href={sns.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${churchName} YouTube`}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition active:bg-white/20"
              >
                <PlayCircle className="size-5" aria-hidden />
              </Link>
            ) : null}
            {sns.instagram ? (
              <Link
                href={sns.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${churchName} Instagram`}
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition active:bg-white/20"
              >
                <InstagramIcon className="size-5" />
              </Link>
            ) : null}
          </div>
        ) : null}

        <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/80">
          <li>
            <Link href="/terms" className="hover:text-white">
              이용약관
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="font-semibold hover:text-white">
              개인정보 처리방침
            </Link>
          </li>
          <li>
            <Link href="/site-map" className="hover:text-white">
              사이트맵
            </Link>
          </li>
        </ul>
        <p className="mt-3 text-center text-[10px] text-white/55">
          © {year} {churchName}. All rights reserved.
        </p>
      </div>

      {/* 데스크톱 푸터 — 4-컬럼 풀 레이아웃 */}
      <div className="container mx-auto hidden px-4 py-6 md:block md:py-8">
        <div className="grid gap-12 text-center md:grid-cols-4 md:gap-10 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div>
              <h2 className="text-2xl font-bold">{churchName}</h2>
              {churchSubtitle ? (
                <p className="mt-1 text-xs text-white/70">{churchSubtitle}</p>
              ) : null}
            </div>
            {adminName ? (
              <p className="mt-5 text-sm text-white/85">담임 {adminName} 목사</p>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {address ? (
                <li className="flex items-start justify-center gap-2 md:justify-start">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{address}</span>
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-start justify-center gap-2 md:justify-start">
                  <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{phone}</span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              SITEMAP
            </h3>
            <div className="mt-5 grid gap-x-6 gap-y-7 sm:grid-cols-2 md:grid-cols-3">
              {NAV_GROUPS.map((group) => {
                const firstHref = group.children[0]?.href ?? "/";
                return (
                  <div key={group.label}>
                    <Link
                      href={firstHref}
                      className="group inline-flex items-center gap-2 border-l-2 border-secondary-sky pl-2.5 text-[15px] font-medium tracking-tight text-white transition hover:border-white"
                    >
                      <span>{group.label}</span>
                    </Link>
                    <ul className="mt-3 space-y-1.5 pl-2.5 text-sm text-white/70">
                      {group.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="inline-flex items-center gap-1 underline-offset-4 transition hover:text-white hover:underline"
                          >
                            <span
                              aria-hidden
                              className="text-white/30 transition group-hover:text-white"
                            >
                              ·
                            </span>
                            <span>{c.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            {sns.band || sns.youtube || sns.instagram ? (
              <>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
                  Follow us
                </h3>
                <div className="mt-4 flex items-center gap-3">
                  {sns.band ? (
                    <Link
                      href={sns.band}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${churchName} 네이버 밴드`}
                      className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-[#00C73C] transition hover:bg-white/20"
                    >
                      <NaverBandIcon className="size-5" />
                    </Link>
                  ) : null}
                  {sns.youtube ? (
                    <Link
                      href={sns.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${churchName} YouTube`}
                      className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      <PlayCircle className="size-5" aria-hidden />
                    </Link>
                  ) : null}
                  {sns.instagram ? (
                    <Link
                      href={sns.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${churchName} Instagram`}
                      className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      <InstagramIcon className="size-5" />
                    </Link>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-4">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/80 md:justify-start">
            <li>
              <Link
                href="/terms"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                이용약관
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="font-semibold underline-offset-4 hover:text-white hover:underline"
              >
                개인정보 처리방침
              </Link>
            </li>
            <li>
              <Link
                href="/site-map"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                사이트맵
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-center text-xs text-white/55 md:text-left">
            © {year} {churchName}. All rights reserved.
            {SITE.founded ? ` · Since ${SITE.founded}` : ""}
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { MapPin, Phone, Wallet, PlayCircle } from "lucide-react";

import { NaverBandIcon } from "@/components/icons/NaverBandIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

import { getAllSiteSettings } from "@/lib/data/site";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { NAV_GROUPS } from "./nav-data";

type Contact = SettingValueMap["contact"];
type Sns = SettingValueMap["sns"];

const EMPTY_CONTACT: Contact = { address: "", phone: "", account: "" };
const EMPTY_SNS: Sns = { band: "", youtube: "", instagram: "" };

export async function Footer() {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSiteSettings();
  } catch {
    settings = {};
  }
  const contact = (settings.contact as Contact | undefined) ?? EMPTY_CONTACT;
  const sns = (settings.sns as Sns | undefined) ?? EMPTY_SNS;
  const offeringSetting = settings.offering_accounts as
    | SettingValueMap["offering_accounts"]
    | undefined;
  const offeringAccounts = offeringSetting?.items ?? [];
  const adminName =
    (typeof settings.admin_name === "string" && settings.admin_name.trim()) ||
    CHURCH.pastorName.replace(/\s*목사\s*$/, "");
  const churchName = CHURCH.name;
  const churchSubtitle = [CHURCH.denomination, CHURCH.founded ? `Since ${CHURCH.founded}` : null]
    .filter(Boolean)
    .join(" · ");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-navy text-white">
      {/* 모바일 푸터 — 사이트맵 + Follow us + 약관 */}
      <div className="container mx-auto px-4 py-8 md:hidden">
        <h3 className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary-sky">
          Sitemap
        </h3>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {NAV_GROUPS.map((group) => {
            const firstHref = group.children[0]?.href ?? "/";
            return (
              <li key={group.label}>
                <Link
                  href={firstHref}
                  className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition active:bg-white/20"
                >
                  {group.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {(sns.band || sns.youtube || sns.instagram) ? (
          <>
            <h3 className="mt-7 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              Follow us
            </h3>
            <div className="mt-3 flex items-center justify-center gap-3">
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
                  <InstagramIcon className="size-5" aria-hidden />
                </Link>
              ) : null}
            </div>
          </>
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
      <div className="container mx-auto hidden px-4 py-14 md:block md:py-16">
        <div className="grid gap-12 text-center md:grid-cols-4 md:gap-10 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div>
              <h2 className="text-2xl font-bold">{churchName}</h2>
              {churchSubtitle ? (
                <p className="mt-1 text-xs text-white/70">{churchSubtitle}</p>
              ) : null}
            </div>
            <p className="mt-5 text-sm text-white/85">
              담임 {adminName} {CHURCH.pastorTitle.includes("목사") ? "" : "목사"}
              {CHURCH.pastorTitle && !CHURCH.pastorTitle.includes("목사") ? ` (${CHURCH.pastorTitle})` : "목사"}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {contact.address ? (
                <li className="flex items-start justify-center gap-2 md:justify-start">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{contact.address}</span>
                </li>
              ) : null}
              {contact.phone ? (
                <li className="flex items-start justify-center gap-2 md:justify-start">
                  <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{contact.phone}</span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              SITEMAP
            </h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-semibold text-white">
                    {group.label}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-white/75">
                    {group.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            {offeringAccounts.length > 0 ? (
              <>
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
                  ONLINE OFFERING
                </h3>
                <p className="mt-4 text-base font-bold text-white">온라인 헌금</p>
                <ul className="mt-3 space-y-1.5 text-sm text-white/90">
                  {offeringAccounts.map((a) => (
                    <li
                      key={a.dept}
                      className="flex items-start justify-center gap-2 md:justify-start"
                    >
                      <Wallet className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span className="break-keep">
                        {a.account}
                        <span className="ml-1 text-white/75">({a.dept})</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/65">
                  ※ 입금 시 이름 뒤에 헌금 종류 첫 글자를 적어주세요.
                  <br />
                  (예: 홍길동주, 홍길동감)
                </p>
              </>
            ) : null}

            {(sns.band || sns.youtube || sns.instagram) ? (
              <>
                <h3 className={`${offeringAccounts.length > 0 ? "mt-8" : ""} text-sm font-semibold tracking-[0.2em] text-secondary-sky`}>
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
                      <InstagramIcon className="size-5" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6">
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
            {CHURCH.founded ? ` · Since ${CHURCH.founded}` : ""}
          </p>
        </div>
      </div>
    </footer>
  );
}

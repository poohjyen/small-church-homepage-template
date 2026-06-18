import { Mail, Phone } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import type { SettingValueMap } from "@/types/database";
import { SITE } from "@/lib/site";

import { SectionContainer } from "./SectionContainer";

type Props = {
  contact?: SettingValueMap["contact"];
};

export function LocationMobile({ contact }: Props) {
  const address = contact?.address?.trim() || "";
  const phoneRaw = contact?.phone?.trim() || "";
  const email = SITE.email?.trim() || "";

  if (!address && !phoneRaw && !email) return null;

  const phonePrimary = phoneRaw ? phoneRaw.split("/")[0]?.trim() || phoneRaw : "";
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");
  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  return (
    <SectionContainer bg="soft" className="py-4">
      <SectionHeading eyebrow="LOCATION" title="오시는 길" />

      <div
        className="mt-5 flex w-full items-center justify-center gap-3"
        aria-hidden
      >
        <span className="h-px flex-1 bg-primary-navy/40" />
        <span className="size-2 rounded-full bg-secondary-sky" />
        <span className="h-px flex-1 bg-primary-navy/40" />
      </div>

      <p className="mt-7 text-center text-xl font-bold text-primary-navy">
        {SITE.name}
      </p>
      {address ? (
        <p className="mt-2 text-center text-[15px] text-charcoal">{address}</p>
      ) : null}

      {mapSrc ? (
        <div className="mt-6 overflow-hidden border border-slate-200 shadow-sm">
          <iframe
            title={`${SITE.name} 지도`}
            src={mapSrc}
            width="100%"
            height={260}
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      ) : null}

      {phonePrimary || email ? (
        <ul className="mt-6 space-y-3">
          {phonePrimary ? (
            <li>
              <a
                href={`tel:${phoneTel}`}
                className="flex items-center justify-center gap-2.5 border border-secondary-sky/30 bg-secondary-sky/5 px-5 py-3.5 text-base transition active:bg-secondary-sky/10"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-navy text-white">
                  <Phone className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-medium text-primary-navy">Tel.</span>
                <span className="font-medium text-charcoal">{phonePrimary}</span>
              </a>
            </li>
          ) : null}
          {email ? (
            <li>
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center gap-2.5 border border-secondary-sky/30 bg-secondary-sky/5 px-5 py-3.5 text-base transition active:bg-secondary-sky/10"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-navy text-white">
                  <Mail className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-medium text-primary-navy">Email.</span>
                <span className="break-all font-medium text-charcoal">{email}</span>
              </a>
            </li>
          ) : null}
        </ul>
      ) : null}
    </SectionContainer>
  );
}

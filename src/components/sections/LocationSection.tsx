import { Mail, Phone } from "lucide-react";

import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SettingValueMap } from "@/types/database";
import { SITE } from "@/lib/site";

import { SectionContainer } from "./SectionContainer";

type Props = {
  contact?: SettingValueMap["contact"];
};

function LineDot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-3 ${className}`}
      aria-hidden
    >
      <span className="h-px flex-1 bg-primary-navy/40" />
      <span className="size-2 rounded-full bg-secondary-sky" />
      <span className="h-px flex-1 bg-primary-navy/40" />
    </div>
  );
}

export function LocationSection({ contact }: Props) {
  const address = contact?.address?.trim() || "";
  const phoneRaw = contact?.phone?.trim() || "";
  const email = SITE.email?.trim() || "";

  if (!address && !phoneRaw && !email) return null;

  const phonePrimary = phoneRaw ? phoneRaw.split("/")[0]?.trim() || phoneRaw : "";
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");
  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  const contactCount = (phonePrimary ? 1 : 0) + (email ? 1 : 0);

  return (
    <SectionContainer bg="soft">
      <div className="mx-auto max-w-5xl">
        <FadeIn direction="down">
          <SectionHeading eyebrow="LOCATION" title="오시는 길" />
          <LineDot className="mt-6" />
        </FadeIn>

        <FadeIn>
          <p className="mt-10 text-center text-2xl font-bold text-primary-navy">
            {SITE.name}
          </p>
          {address ? (
            <p className="mt-3 text-center text-base text-charcoal md:text-lg">
              {address}
            </p>
          ) : null}
        </FadeIn>

        {mapSrc ? (
          <FadeIn direction="zoom">
            <div className="mt-12 overflow-hidden border border-slate-200 shadow-sm">
              <iframe
                title={`${SITE.name} 지도`}
                src={mapSrc}
                width="100%"
                height={420}
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </FadeIn>
        ) : null}

        {contactCount > 0 ? (
          <ul
            className={`mt-12 grid gap-12 ${
              contactCount === 2
                ? "grid-cols-2"
                : "mx-auto max-w-xs grid-cols-1"
            }`}
          >
            {phonePrimary ? (
              <li>
                <FadeIn
                  direction="right"
                  className="flex flex-col items-center text-center"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-primary-navy text-white shadow-sm">
                    <Phone className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <LineDot className="mt-5" />
                  <p className="mt-5 text-lg font-medium text-primary-navy">Tel.</p>
                  <a
                    href={`tel:${phoneTel}`}
                    className="mt-1 text-base text-charcoal transition hover:text-secondary-sky"
                  >
                    {phonePrimary}
                  </a>
                </FadeIn>
              </li>
            ) : null}

            {email ? (
              <li>
                <FadeIn
                  direction="left"
                  delay={100}
                  className="flex flex-col items-center text-center"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-primary-navy text-white shadow-sm">
                    <Mail className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <LineDot className="mt-5" />
                  <p className="mt-5 text-lg font-medium text-primary-navy">Email.</p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 break-all text-base text-charcoal transition hover:text-secondary-sky"
                  >
                    {email}
                  </a>
                </FadeIn>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </SectionContainer>
  );
}

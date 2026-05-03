import { MapPin, Phone } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import type { SettingValueMap } from "@/types/database";
import { CHURCH } from "../../../church.config";

import { SectionContainer } from "./SectionContainer";

type Props = {
  contact?: SettingValueMap["contact"];
};

export function LocationSection({ contact }: Props) {
  const address = contact?.address?.trim() || "";
  const phone = contact?.phone?.trim() || "";

  if (!address && !phone) return null;

  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  return (
    <SectionContainer bg="white">
      <SectionHeading eyebrow="LOCATION" title="오시는 길" />

      <div className="mt-6 grid gap-4 md:mt-12 md:gap-8 md:grid-cols-2">
        {mapSrc ? (
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
            <iframe
              title={`${CHURCH.name} 지도`}
              src={mapSrc}
              width="100%"
              height={420}
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        ) : null}

        <ul className="space-y-2 md:space-y-6">
          {address ? (
            <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-black/5 md:gap-4 md:rounded-2xl md:p-6">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-secondary-sky md:mt-1 md:size-6"
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-warm-gray md:text-sm">
                  주소
                </p>
                <p className="mt-0.5 text-sm text-charcoal md:mt-1 md:text-lg">
                  {address}
                </p>
              </div>
            </li>
          ) : null}

          {phone ? (
            <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-black/5 md:gap-4 md:rounded-2xl md:p-6">
              <Phone
                className="mt-0.5 size-5 shrink-0 text-secondary-sky md:mt-1 md:size-6"
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-warm-gray md:text-sm">
                  연락처
                </p>
                <p className="mt-0.5 text-sm text-charcoal md:mt-1 md:text-lg">
                  {phone}
                </p>
              </div>
            </li>
          ) : null}
        </ul>
      </div>
    </SectionContainer>
  );
}

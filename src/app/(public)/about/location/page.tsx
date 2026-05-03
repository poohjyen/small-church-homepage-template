import { MapPin, Phone } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { PageBlockContent } from "@/components/board/PageBlockContent";
import { getSiteSetting } from "@/lib/data/site";
import { getPageBlocks } from "@/lib/data/page-blocks";
import { CHURCH } from "../../../../../church.config";

export const metadata = { title: "오시는 길" };

export default async function LocationPage() {
  const [contact, blocks] = await Promise.all([
    getSiteSetting("contact"),
    getPageBlocks("location"),
  ]);
  const address = contact?.address?.trim() || "";
  const phone = contact?.phone?.trim() || "";
  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  return (
    <>
      <PageHero eyebrow="LOCATION" title="오시는 길" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        {mapSrc ? (
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
            <iframe
              title={`${CHURCH.name} 지도`}
              src={mapSrc}
              width="100%"
              height={560}
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mx-auto max-w-6xl rounded-2xl bg-slate-50 p-12 text-center text-warm-gray ring-1 ring-black/5">
            아직 주소가 등록되지 않았습니다. /admin/settings에서 주소를 입력해 주세요.
          </div>
        )}

        {(address || phone) ? (
          <ul className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2">
            {address ? (
              <li className="flex items-start gap-4 rounded-xl bg-slate-50 p-6 ring-1 ring-black/5">
                <MapPin
                  className="mt-1 size-6 shrink-0 text-secondary-sky"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-warm-gray">
                    주소
                  </p>
                  <p className="mt-2 text-base text-charcoal md:text-lg">
                    {address}
                  </p>
                </div>
              </li>
            ) : null}

            {phone ? (
              <li className="flex items-start gap-4 rounded-xl bg-slate-50 p-6 ring-1 ring-black/5">
                <Phone
                  className="mt-1 size-6 shrink-0 text-secondary-sky"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-warm-gray">
                    연락처
                  </p>
                  <p className="mt-2 text-base text-charcoal md:text-lg">
                    {phone}
                  </p>
                </div>
              </li>
            ) : null}
          </ul>
        ) : null}

        {blocks.length > 0 ? (
          <div className="mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-12">
            <PageBlockContent blocks={blocks} />
          </div>
        ) : null}
      </div>
    </>
  );
}

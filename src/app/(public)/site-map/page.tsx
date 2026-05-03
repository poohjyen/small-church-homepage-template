import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { NAV_GROUPS } from "@/components/layout/nav-data";

export const metadata = { title: "사이트맵" };

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보 처리방침", href: "/privacy" },
];

export default function SiteMapPage() {
  return (
    <>
      <PageHero eyebrow="SITEMAP" title="사이트맵" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3">
          {NAV_GROUPS.map((group) => (
            <section
              key={group.label}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/5"
            >
              <h2 className="text-lg font-bold text-primary-navy">
                {group.label}
              </h2>
              <ul className="mt-4 space-y-2.5 text-base text-charcoal">
                {group.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="inline-block underline-offset-4 transition hover:text-secondary-sky hover:underline"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-2xl bg-soft p-6 ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-primary-navy">정책 및 안내</h2>
            <ul className="mt-4 space-y-2.5 text-base text-charcoal">
              {FOOTER_LINKS.map((f) => (
                <li key={f.href}>
                  <Link
                    href={f.href}
                    className="inline-block underline-offset-4 transition hover:text-secondary-sky hover:underline"
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

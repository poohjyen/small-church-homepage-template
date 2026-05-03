import { SITE, getSiteUrl } from "@/lib/site";

export function OrganizationJsonLd() {
  const base = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: SITE.name,
    alternateName: SITE.fullName,
    url: base,
    logo: `${base}${SITE.logo}`,
    image: `${base}${SITE.ogImage}`,
    description: SITE.description,
    foundingDate: SITE.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.addressCountry,
    },
    telephone: SITE.telephone[0],
    email: SITE.email,
    sameAs: [SITE.social.band].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

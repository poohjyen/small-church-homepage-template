import { SITE, getSiteUrl } from "@/lib/site";

type Props = {
  title: string;
  description?: string | null;
  author?: string | null;
  datePublished: string;
  url: string;
  image?: string | null;
};

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  url,
  image,
}: Props) {
  const base = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished,
    inLanguage: "ko-KR",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${base}${SITE.logo}` },
    },
  };
  if (description) data.description = description;
  if (author) data.author = { "@type": "Person", name: author };
  if (image) data.image = image.startsWith("http") ? image : `${base}${image}`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 간단한 RSS 2.0 빌더 — 외부 라이브러리 없이 문자열 생성

import { getSiteUrl } from "@/lib/site";

export type RssItem = {
  title: string;
  link: string; // 절대 URL
  description?: string;
  pubDate: string; // ISO
  guid?: string; // 기본값은 link
  author?: string;
};

export type RssChannel = {
  title: string;
  link: string; // 절대 URL
  description: string;
  language?: string;
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string): string {
  return `<![CDATA[${s.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rfc822(iso: string): string {
  // RSS pubDate는 RFC822 형식 권장
  const d = new Date(iso);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export function buildRss(channel: RssChannel, items: RssItem[]): string {
  const lang = channel.language ?? "ko-kr";
  const base = getSiteUrl();
  const itemsXml = items
    .map((it) => {
      const guid = it.guid ?? it.link;
      const desc = it.description
        ? `<description>${cdata(it.description)}</description>`
        : "";
      const author = it.author
        ? `<author>${escapeXml(it.author)}</author>`
        : "";
      return [
        "<item>",
        `<title>${cdata(it.title)}</title>`,
        `<link>${escapeXml(it.link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(guid)}</guid>`,
        `<pubDate>${rfc822(it.pubDate)}</pubDate>`,
        desc,
        author,
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${cdata(channel.title)}</title>
<link>${escapeXml(channel.link)}</link>
<description>${cdata(channel.description)}</description>
<language>${escapeXml(lang)}</language>
<atom:link href="${escapeXml(channel.link)}" rel="self" type="application/rss+xml" />
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<generator>${escapeXml(`${base} RSS`)}</generator>
${itemsXml}
</channel>
</rss>`;
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

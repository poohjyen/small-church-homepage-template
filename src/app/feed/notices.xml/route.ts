import { getNotices } from "@/lib/data/notices";
import { absoluteUrl, SITE } from "@/lib/site";
import { buildRss, rssResponse } from "@/lib/rss";

export const revalidate = 300;

export async function GET() {
  const { data } = await getNotices({
    page: 1,
    perPage: 50,
    category: "news",
  }).catch(() => ({ data: [], total: 0 }));

  const xml = buildRss(
    {
      title: `${SITE.name} 교회소식`,
      link: absoluteUrl("/feed/notices.xml"),
      description: `${SITE.name} 최근 교회소식 RSS 피드`,
    },
    data.map((n) => ({
      title: n.title,
      link: absoluteUrl(`/notices/${n.id}`),
      description: n.content ? n.content.slice(0, 240) : undefined,
      pubDate: n.created_at,
    })),
  );

  return rssResponse(xml);
}

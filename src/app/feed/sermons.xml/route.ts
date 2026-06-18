import { getSermons } from "@/lib/data/sermons";
import { absoluteUrl, SITE } from "@/lib/site";
import { buildRss, rssResponse } from "@/lib/rss";

export const revalidate = 300;

export async function GET() {
  const { data } = await getSermons({
    page: 1,
    perPage: 50,
    publishedOnly: true,
  }).catch(() => ({
    data: [],
    total: 0,
  }));

  const xml = buildRss(
    {
      title: `${SITE.name} 주일설교`,
      link: absoluteUrl("/feed/sermons.xml"),
      description: `${SITE.name} 최근 주일설교 RSS 피드`,
    },
    data.map((s) => ({
      title: s.title,
      link: absoluteUrl(`/sermons/${s.id}`),
      description: s.summary ?? s.scripture ?? undefined,
      pubDate: s.sermon_date,
      author: s.preacher,
    })),
  );

  return rssResponse(xml);
}

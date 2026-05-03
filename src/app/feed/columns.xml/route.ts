import { getColumns } from "@/lib/data/columns";
import { absoluteUrl, SITE } from "@/lib/site";
import { buildRss, rssResponse } from "@/lib/rss";

export const revalidate = 300;

export async function GET() {
  const { data } = await getColumns({ page: 1, perPage: 50 }).catch(() => ({
    data: [],
    total: 0,
  }));

  const xml = buildRss(
    {
      title: `${SITE.name} 목양칼럼`,
      link: absoluteUrl("/feed/columns.xml"),
      description: `${SITE.name} 최근 목양칼럼 RSS 피드`,
    },
    data.map((c) => ({
      title: c.title,
      link: absoluteUrl(`/columns/${c.id}`),
      description: c.content ? c.content.slice(0, 240) : undefined,
      pubDate: c.published_date,
      author: c.author,
    })),
  );

  return rssResponse(xml);
}

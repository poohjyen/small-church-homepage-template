import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getNotices } from "@/lib/data/notices";
import { getSermons } from "@/lib/data/sermons";
import { getColumns } from "@/lib/data/columns";
import { getGalleries } from "@/lib/data/galleries";
import { getCustomPageSummaries } from "@/lib/data/page-blocks";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/vision", changeFrequency: "yearly", priority: 0.7 },
  { path: "/about/worship", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/location", changeFrequency: "yearly", priority: 0.6 },
  { path: "/missions", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sermons", changeFrequency: "weekly", priority: 0.9 },
  { path: "/columns", changeFrequency: "weekly", priority: 0.7 },
  { path: "/notices", changeFrequency: "weekly", priority: 0.8 },
  { path: "/bulletins", changeFrequency: "weekly", priority: 0.7 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.5 },
  { path: "/forms/newcomer", changeFrequency: "yearly", priority: 0.5 },
  { path: "/forms/prayer", changeFrequency: "yearly", priority: 0.5 },
  { path: "/forms/visit", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/site-map", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const [notices, sermons, columns, galleries, customPages] = await Promise.all([
    getNotices({ page: 1, perPage: 200 }).catch(() => ({ data: [], total: 0 })),
    getSermons({ page: 1, perPage: 200 }).catch(() => ({ data: [], total: 0 })),
    getColumns({ page: 1, perPage: 200 }).catch(() => ({ data: [], total: 0 })),
    getGalleries({ page: 1, perPage: 200 }).catch(() => ({ data: [], total: 0 })),
    getCustomPageSummaries().catch(() => []),
  ]);

  const noticeEntries: MetadataRoute.Sitemap = notices.data.map((n) => ({
    url: `${base}/notices/${n.id}`,
    lastModified: new Date(n.updated_at ?? n.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sermonEntries: MetadataRoute.Sitemap = sermons.data.map((s) => ({
    url: `${base}/sermons/${s.id}`,
    lastModified: new Date(s.created_at),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const columnEntries: MetadataRoute.Sitemap = columns.data.map((c) => ({
    url: `${base}/columns/${c.id}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const galleryEntries: MetadataRoute.Sitemap = galleries.data.map((g) => ({
    url: `${base}/gallery/${g.id}`,
    lastModified: new Date(g.created_at),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const customPageEntries: MetadataRoute.Sitemap = customPages.map((p) => ({
    url: `${base}/pages/${p.page_key}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...noticeEntries,
    ...sermonEntries,
    ...columnEntries,
    ...galleryEntries,
    ...customPageEntries,
  ];
}

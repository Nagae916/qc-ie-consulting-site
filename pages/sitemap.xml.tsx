import type { GetServerSideProps } from "next";
import { allGuides } from "contentlayer/generated";

import { caseStudies } from "@/data/cases";
import { siteIdentity, themes } from "@/data/n-ie-lab";
import { labTools } from "@/data/site";
import { isPublishedGuideStatus } from "@/lib/frontmatter-normalization";

const staticRoutes = [
  "/",
  "/themes",
  "/cases",
  "/tools",
  "/learn",
  "/about",
  "/services",
  "/contact",
  "/guides",
  "/guides/qc",
  "/guides/stat",
  "/guides/engineer",
  "/guides/production",
  "/references",
] as const;

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const guideUrl = (guide: (typeof allGuides)[number]) => {
  const url = (guide as { url?: unknown }).url;
  if (typeof url === "string" && url.startsWith("/guides/")) return url;
  const exam = String((guide as { exam?: unknown }).exam ?? "qc");
  const slug = String((guide as { slug?: unknown }).slug ?? guide._raw.flattenedPath.split("/").pop() ?? "");
  return `/guides/${exam}/${slug}`;
};

const guideLastModified = (guide: (typeof allGuides)[number]) => {
  const values = guide as { updatedAtAuto?: unknown; updatedAt?: unknown; date?: unknown };
  const raw = String(values.updatedAtAuto ?? values.updatedAt ?? values.date ?? "");
  const time = Date.parse(raw);
  return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const guideEntries: Array<{ path: string; lastmod?: string }> = allGuides
    .filter((guide) => isPublishedGuideStatus((guide as { status?: unknown }).status))
    .map((guide) => {
      const path = guideUrl(guide);
      const lastmod = guideLastModified(guide);
      return lastmod ? { path, lastmod } : { path };
    });

  const entries: Array<{ path: string; lastmod?: string }> = [
    ...staticRoutes.map((path) => ({ path })),
    ...themes.map((theme) => ({ path: `/themes/${theme.slug}` })),
    ...caseStudies.map((study) => ({ path: `/cases/${study.slug}`, lastmod: `${study.updatedAt}T00:00:00.000Z` })),
    ...labTools.filter((tool) => tool.href.startsWith("/tools/")).map((tool) => ({ path: tool.href })),
    ...guideEntries,
  ];

  const unique = Array.from(new Map(entries.map((entry) => [entry.path, entry])).values());
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique
    .map((entry) => {
      const loc = escapeXml(`${siteIdentity.siteUrl}${entry.path}`);
      return `  <url>\n    <loc>${loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}\n  </url>`;
    })
    .join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();

  return { props: {} };
};

export default function SitemapPage() {
  return null;
}

import Head from "next/head";

import { siteIdentity } from "@/data/n-ie-lab";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type SiteMetaProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: JsonLdValue;
};

const toAbsoluteUrl = (value: string) =>
  value.startsWith("http") ? value : `${siteIdentity.siteUrl}${value.startsWith("/") ? value : `/${value}`}`;

export function SiteMeta({
  title,
  description = siteIdentity.description,
  path = "/",
  image = "/images/home/n-ie-lab-manufacturing-hero.jpg",
  type = "website",
  noIndex = false,
  jsonLd,
}: SiteMetaProps) {
  const pageTitle = title ? `${title} | ${siteIdentity.name}` : "N-IE Lab｜品質・生産・データをつなぐ経営工学メディア";
  const canonical = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteIdentity.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </Head>
  );
}

export const absoluteUrl = toAbsoluteUrl;

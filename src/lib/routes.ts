// src/lib/routes.ts
export const guideUrl = (slug: string) => `/guides/qc/${slug}` as const;
export const guidesTop = "/guides" as const;
export const guidesQcTop = "/guides/qc" as const;

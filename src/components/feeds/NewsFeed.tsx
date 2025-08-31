// src/components/feeds/NewsFeed.tsx
import { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
};
type RawNews = any;

function toArray<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === "object" && Array.isArray((v as any).items)) {
    return (v as any).items as T[];
  }
  return [];
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function sanitize(raw: RawNews): NewsItem | null {
  const title = typeof raw?.title === "string" ? raw.title : "";
  const link =
    (typeof raw?.link === "string" && raw.link) ||
    (typeof raw?.guid === "strin

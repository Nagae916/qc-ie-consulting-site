// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import fs from "fs";
import path from "path";
import cp from "child_process";

/** ── MDX/Math & HTML処理 ─────────────────────────────────────────────── */
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** ── 定数/型 ─────────────────────────────────────────────────────────── */
const CANONICAL_EXAMS = ["qc", "stat", "engineer"] as const;
type Exam = (typeof CANONICAL_EXAMS)[number];

/** ── ユーティリティ ────────────────────────────────────────────────── */
const safeString = (v: unknown, fb = ""): string => {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fb;
};

const fromPath = (parts: string[]) => {
  const p = parts[0] === "guides" ? parts.slice(1) : parts;
  return { exam: safeString(p[0]), slug: safeString(p[p.length - 1]) };
};

const normalizeExam = (v: unknown, pathExam: string): Exam => {
  const raw = safeString(v, pathExam).toLowerCase();
  const e =
    raw === "qc"
      ? "qc"
      : raw === "stat" || raw === "stats" || raw === "statistics"
      ? "stat"
      : raw === "engineer" || raw === "pe" || raw === "eng"
      ? "engineer"
      : "qc";
  return e as Exam;
};

const normalizeSlug = (v: unknown, pathSlug: string) => safeString(v, pathSlug);

const normalizeTags = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => safeString(x)).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

// 文字列 → ISO（失敗時は ""）
const toIso = (v: unknown): string => {
  const s = safeString(v);
  if (!s) return "";
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
};

// Git の最終コミット日時（ISO）を取得、ダメなら fs.mtime
const getLastUpdatedIso = (relFromContentDir: string): string => {
  try {
    const abs = path.join(process.cwd(), "content", relFromContentDir);
    const iso = cp
      .execSync(`git log -1 --format=%cI -- "${abs}"`, {
        stdio: ["ignore", "pipe", "ignore"],
      })
      .toString()
      .trim();
    if (iso) return iso;
    const st = fs.statSync(abs);
    return new Date(st.mtimeMs).toISOString();
  } catch {
    try {
      const abs = path.join(process.cwd(), "content", relFromContentDir);
      const st = fs.statSync(abs);
      return new Date(st.mtimeMs).toISOString();
    } catch {
      return "";
    }
  }
};

/** ── DocumentType: Guide（MDX を強制） ─────────────────────────────── */
export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx", // ← 最重要: MDX として処理（MD も含めてコンパイル可能）
  filePathPattern: "guides/**/*.{md,mdx}",
  fields: {
    title: { type: "string", required: true },
    exam: { type: "string" },
    slug: { type: "string" },
    section: { type: "string" },
    description: { type: "string" },
    tags: { type: "json" },
    version: { type: "string", default: "1.0.0" },
    status: { type: "string", default: "published" },
    updatedAt: { type: "string" },
    date: { type: "date" },
  },
  computedFields: {
    exam: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam } = fromPath(parts);
        return normalizeExam((doc as any).exam, pathExam);
      },
    },
    slug: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { slug: pathSlug } = fromPath(parts);
        return normalizeSlug((doc as any).slug, pathSlug);
      },
    },
    url: {
      type: "string",
      resolve: (doc) => {
        const parts = doc._raw.flattenedPath.split("/");
        const { exam: pathExam, slug: pathSlug } = fromPath(parts);
        const exam = normalizeExam((doc as any).exam, pathExam);
        const slug = normalizeSlug((doc as any).slug, pathSlug);
        return `/guides/${exam}/${slug}`;
      },
    },
    tags: {
      type: "json",
      resolve: (doc) => normalizeTags((doc as any).tags),
    },
    // frontmatter > Git > date の順
    updatedAtAuto: {
      type: "string",
      resolve: (doc) => {
        const fromFm = toIso((doc as any).updatedAt);
        if (fromFm) return fromFm;
        const fromGit = getLastUpdatedIso(doc._raw.sourceFilePath);
        if (fromGit) return fromGit;
        return toIso((doc as any).date);
      },
    },
  },
}));

/** ── makeSource ───────────────────────────────────────────────────────
 * 重要ポイント：
 * - sanitize（rehype-sanitize）は **使用しない**：MDXコンポーネント（<ChiSquareGuide/> 等）を
 *   HAST で消さず、後段の `useMDXComponent(body.code)` + `components={GUIDE_COMPONENTS}` で
 *   確実に実体化させるため。
 */
export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    // MDX -> "コード"（React）として出力。ページ側で useMDXComponent(body.code) を使う前提
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      // rehype-sanitize は入れない（Reactタグ除去の原因になり得るため）
    ],
  },
});

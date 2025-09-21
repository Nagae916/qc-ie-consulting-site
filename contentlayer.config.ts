// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import fs from "fs";
import path from "path";
import cp from "child_process";

/** ── MDX/Math & HTML処理 ─────────────────────────────────────────────── */
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";

/** ── 定数/型 ─────────────────────────────────────────────────────────── */
const CANONICAL_EXAMS = ["qc", "stat", "engineer"] as const;
type Exam = (typeof CANONICAL_EXAMS)[number];

/** ── ユーティリティ ────────────────────────────────────────────────── */
const safeString = (v: unknown, fb = ""): string => {
  const s = typeof v === "string" ? v.trim() : String(v ?? "").trim();
  return s || fb;
};
const fromPath = (parts: string[]) => {
  const p = parts[0] === "guides" ? parts.slice(1) : parts; // guides/qc/slug → qc, slug
  return { exam: safeString(p[0]), slug: safeString(p[p.length - 1]) };
};
const normalizeExam = (v: unknown, pathExam: string): Exam => {
  const raw = safeString(v, pathExam).toLowerCase();
  const e =
    raw === "qc" ? "qc" :
    raw === "stat" || raw === "stats" || raw === "statistics" ? "stat" :
    raw === "engineer" || raw === "pe" || raw === "eng" ? "engineer" :
    "qc";
  return e as Exam;
};
const normalizeSlug = (v: unknown, pathSlug: string) => safeString(v, pathSlug);
const normalizeTags = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => safeString(x)).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
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
    const iso = cp.execSync(`git log -1 --format=%cI -- "${abs}"`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim();
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

/** ── DocumentType: Guide（必ず MDX モード） ───────────────────────── */
export const Guide = defineDocumentType(() => ({
  name: "Guide",
  contentType: "mdx", // ★ インタラクティブMDXを有効化
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

/** ── rehype-sanitize 許可スキーマ拡張 ───────────────────────────────
 * MDXの「生HTML部分」にだけ効く。Reactコンポーネントはこの制約を受けない。
 * ガイドで使う <details> や className, style, input/button などを許可する。
 */
const sanitizeSchema = (() => {
  const base: any = JSON.parse(JSON.stringify(defaultSchema));

  // 既存にマージ
  base.attributes ||= {};

  // ▼ 全要素で許可する属性を拡張（class と style を緩める）
  base.attributes["*"] = [
    ...(base.attributes["*"] || []),
    "id",
    "className",
    "style",
  ];

  // ▼ KaTeX 用の className（katex / katex-xxx）
  const katexClass = ["className", /^katex(?:-\w+)?$/];
  base.attributes["span"] = [...(base.attributes["span"] || []), katexClass];
  base.attributes["div"] = [...(base.attributes["div"] || []), katexClass];

  // ▼ コードブロック（language-xxx）
  base.attributes["code"] = [...(base.attributes["code"] || []), ["className", /^language-/]];

  // ▼ 安全な外部リンク
  base.attributes["a"] = [
    ...(base.attributes["a"] || []),
    ["target", /^_blank$/],
    ["rel", /^(?:nofollow|noreferrer|noopener)(?:\s+(?:nofollow|noreferrer|noopener))*$/],
  ];

  // ▼ よく使う要素を明示許可（details/summary/table/img/input/button 等）
  base.tagNames = Array.from(
    new Set([
      ...(base.tagNames || []),
      "section",
      "details",
      "summary",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "input",
      "button",
      "canvas",
    ])
  );

  // table セル結合
  base.attributes["th"] = [...(base.attributes["th"] || []), "colSpan", "rowSpan"];
  base.attributes["td"] = [...(base.attributes["td"] || []), "colSpan", "rowSpan"];

  // img
  base.attributes["img"] = [
    ...(base.attributes["img"] || []),
    "src",
    "alt",
    "title",
    "width",
    "height",
    "loading",
    "decoding",
  ];

  // input / button（簡易許可）
  base.attributes["input"] = [
    ...(base.attributes["input"] || []),
    "type",
    "value",
    "min",
    "max",
    "step",
    "checked",
    "placeholder",
    "disabled",
    "name",
  ];
  base.attributes["button"] = [
    ...(base.attributes["button"] || []),
    "type",
    "disabled",
    "name",
    "value",
  ];

  // canvas（チャート系で使う場合に備えて）
  base.attributes["canvas"] = [...(base.attributes["canvas"] || []), "width", "height"];

  return base;
})();

/** ── makeSource ─────────────────────────────────────────────────────── */
export default makeSource({
  contentDirPath: "content",
  documentTypes: [Guide],
  mdx: {
    // 数式 → KaTeX → 見出し → 自動リンク → 最後にサニタイズ
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypeSanitize, sanitizeSchema],
    ],
  },
});

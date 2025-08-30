// src/components/home/HomeLibrary.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

// exam を正規化
function normalizeExam(exam: string | undefined): "qc" | "stat" | "engineer" | "other" {
  const x = String(exam ?? "").toLowerCase();
  if (x === "qc") return "qc";
  if (x === "stat" || x === "stats") return "stat";
  if (x === "engineer" || x === "pe") return "engineer";
  return "other";
}

// 安全な日付パース（updatedAt > date > 0）
function parseDate(g: Guide): number {
  const raw = (g as any).updatedAt ?? (g as any).date ?? "";
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : 0;
}
function ymd(n: number): string {
  if (!n) return "";
  const d = new Date(n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

const badgeDot: Record<"qc" | "stat" | "engineer", string> = {
  qc: "bg-orange-500",
  stat: "bg-blue-600",
  engineer: "bg-green-600",
};

function UpdateList({
  items,
  basePath,
}: {
  items: Guide[];
  basePath: "/guides/qc" | "/guides/stat" | "/guides/engineer";
}) {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 text-sm font-semibold text-gray-700">更新履歴（最新2件）</div>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">更新情報はまだありません。</div>
      ) : (
        <ul className="space-y-1">
          {items.map((g) => {
            const when = ymd(parseDate(g));
            const slug = String(g.slug ?? "");
            return (
              <li key={g._id} className="text-sm">
                <Link
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
                  href={`${basePath}/${slug}`}
                >
                  {g.title}
                </Link>
                {when && <span className="ml-2 text-xs text-gray-500">{when}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function HomeLibrary() {
  const guides = allGuides.filter((g) => g.status !== "draft");
  const qc = guides.filter((g) => normalizeExam(g.exam) === "qc");
  const stat = guides.filter((g) => normalizeExam(g.exam) === "stat");
  const eng = guides.filter((g) => normalizeExam(g.exam) === "engineer");

  const latest2 = (arr: Guide[]) => [...arr].sort((a, b) => parseDate(b) - parseDate(a)).slice(0, 2);
  const qc2 = latest2(qc);
  const stat2 = latest2(stat);
  const eng2 = latest2(eng);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-extrabold text-center">学習ガイドライブラリ</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {/* QC */}
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${badgeDot.qc}`} />
            <span className="text-sm font-semibold text-gray-600">品質管理</span>
          </div>
          <h3 className="mb-2 text-lg font-bold">QC ガイド</h3>
          <p className="mb-4 text-sm text-gray-600">
            現場改善・QC手法の要点をコンパクトに。QC七つ道具／新QC七つ道具など。
          </p>
          <Link
            href="/guides/qc"
            className="mb-4 inline-block rounded-lg bg-orange-500 px-4 py-2 text-white hover:opacity-90"
          >
            QCのガイドを見る
          </Link>
          <UpdateList items={qc2} basePath="/guides/qc" />
        </article>

        {/* 統計 */}
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${badgeDot.stat}`} />
            <span className="text-sm font-semibold text-gray-600">統計</span>
          </div>
          <h3 className="mb-2 text-lg font-bold">統計ガイド</h3>
          <p className="mb-4 text-sm text-gray-600">
            検定・推定・管理図など、品質・R&Dで使う統計を実務目線で整理。
          </p>
          <Link
            href="/guides/stat"
            className="mb-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:opacity-90"
          >
            統計のガイドを見る
          </Link>
          <UpdateList items={stat2} basePath="/guides/stat" />
        </article>

        {/* 技術士 */}
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${badgeDot.engineer}`} />
            <span className="text-sm font-semibold text-gray-600">技術士</span>
          </div>
          <h3 className="mb-2 text-lg font-bold">技術士ガイド</h3>
          <p className="mb-4 text-sm text-gray-600">
            学習計画や要点整理を中心に、効率よく得点力を高めるナレッジ。
          </p>
          <Link
            href="/guides/engineer"
            className="mb-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-white hover:opacity-90"
          >
            技術士のガイドを見る
          </Link>
          <UpdateList items={eng2} basePath="/guides/engineer" />
        </article>
      </div>
    </section>
  );
}

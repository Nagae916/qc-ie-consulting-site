import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import { caseStudies } from "@/data/cases";

export default function CasesIndexPage() {
  return (
    <>
      <SiteMeta
        title="ケースから学ぶ"
        description="品質・生産・データの実務課題を、背景、制約、判断、成果物の順で読み解く匿名化ケースです。"
        path="/cases"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "N-IE Lab ケースから学ぶ",
          url: "https://n-ie-qclab.com/cases",
        }}
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">Case studies</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">ケースから、判断の組み立て方を学ぶ</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              成功談を並べるのではなく、何が分からず、どの制約があり、どの情報から何を決めたかを整理します。成果物まで見ることで、別の現場へ応用できる形にします。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="初期ケース" description="企業、製品、数値を特定できないよう再構成した学習ケースです。" />
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {caseStudies.map((study) => (
              <ContentCard
                key={study.slug}
                href={`/cases/${study.slug}`}
                eyebrow="ケースから学ぶ"
                title={study.title}
                description={study.summary}
                meta="背景・制約・判断・成果物"
                action="判断過程を見る"
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

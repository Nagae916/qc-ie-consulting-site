// pages/index.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { GetStaticProps } from 'next';
import { allGuides, type Guide } from 'contentlayer/generated';

type ExamKey = 'qc' | 'stat' | 'engineer';

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: '品質管理',
  stat: '統計',
  engineer: '技術士',
};

const EXAM_DESC: Record<ExamKey, string> = {
  qc: '現場改善・QC手法の要点をコンパクトに。QC七つ道具／新QC七つ道具など。',
  stat: '検定・推定・管理図など。品質・R&Dで使う統計を実務目線で整理。',
  engineer: '学習計画や要点整理を中心に、効率よく得点力を高めるナレッジ。',
};

const COLORS = {
  qc: { badgeDot: 'text-[#D26B00]', headerBg: 'bg-[#FFE5CC]', button: 'bg-[#F28C28] hover:bg-[#e87f18] text-white' },
  stat: { badgeDot: 'text-[#0058B0]', headerBg: 'bg-[#CCE5FF]', button: 'bg-[#2D75D3] hover:bg-[#1f62b5] text-white' },
  engineer: { badgeDot: 'text-[#0F7A35]', headerBg: 'bg-[#CCF5CC]', button: 'bg-[#1E9E50] hover:bg-[#198543] text-white' },
} as const;

const NewsFeed = dynamic(() => import('@/components/feeds/NewsFeed'), { ssr: false });
const Bloglist = dynamic(() => import('@/components/feeds/Bloglist'), { ssr: false });
const NoteFeed = dynamic(() => import('@/components/feeds/NoteFeed'), { ssr: false });
const XTimeline = dynamic(() => import('@/components/feeds/XTimeline'), { ssr: false });
const InstagramFeed = dynamic(() => import('@/components/feeds/InstagramFeed'), { ssr: false });

const asExamKey = (v: Guide['exam']): ExamKey | null => (v === 'qc' || v === 'stat' || v === 'engineer' ? v : null);

const sortKey = (g: Guide) =>
  Date.parse(String((g as any).updatedAt ?? '')) ||
  Date.parse(String((g as any).date ?? '')) ||
  0;

type Props = {
  latestByExam: { qc: Guide[]; stat: Guide[]; engineer: Guide[] };
  latestAll: Guide[];
};

export default function Home({ latestByExam, latestAll }: Props) {
  const CategoryCard = ({ exam }: { exam: ExamKey }) => {
    const color = COLORS[exam];
    const items = latestByExam[exam];

    return (
      <section className='rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden'>
        <div className={`${color.headerBg} px-6 py-4`}>
          <div className='flex items-center gap-2 text-sm text-black/70'>
            <span className={`${color.badgeDot}`}>●</span>
            <span>{EXAM_LABEL[exam]}</span>
          </div>
          <h3 className='mt-1 text-xl font-bold text-black'>
            {exam === 'qc' ? 'QC ガイド' : exam === 'stat' ? '統計ガイド' : '技術士ガイド'}
          </h3>
          <p className='mt-1 text-sm text-black/70'>{EXAM_DESC[exam]}</p>
          <div className='mt-3'>
            <Link href={`/guides/${exam}`} className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold ${color.button}`}>
              {exam === 'qc' ? 'QCのガイドを見る' : exam === 'stat' ? '統計のガイドを見る' : '技術士のガイドを見る'}
            </Link>
          </div>
        </div>

        <div className='px-6 py-5'>
          <div className='rounded-xl border border-black/10 bg-white'>
            <div className='border-b border-black/10 px-4 py-2 text-sm text-black/70'>更新履歴（最新2件）</div>
            <div className='p-4 text-sm'>
              {items.length === 0 ? (
                <p className='text-black/50'>更新情報はまだありません。</p>
              ) : (
                <ul className='space-y-2'>
                  {items.map((g) => (
                    <li key={g._id} className='leading-relaxed'>
                      <Link href={g.url} className='text-blue-700 hover:underline'>
                        {g.title}
                      </Link>
                      {sortKey(g) > 0 && <span className='ml-2 text-black/40'>{new Date(sortKey(g)).toLocaleDateString('ja-JP')}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className='mx-auto max-w-6xl px-4 py-10'>
      <section className='rounded-3xl bg-emerald-50 px-8 py-8'>
        <h1 className='text-3xl font-extrabold tracking-tight'>QC × IE LABO</h1>
        <p className='mt-2 text-black/70'>見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。</p>
      </section>

      <h2 className='mt-10 text-center text-2xl font-bold'>学習ガイドライブラリ</h2>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <CategoryCard exam='qc' />
        <CategoryCard exam='stat' />
        <CategoryCard exam='engineer' />
      </div>

      <section className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>お知らせ</h3>
          <NewsFeed limit={5} variant='card' />
        </div>

        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>X（旧Twitter）タイムライン</h3>
          <XTimeline username='@n_ieqclab' limit={5} />
        </div>
      </section>

      <section className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>ブログ最新投稿</h3>
          <Bloglist />
        </div>

        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>Note フィード</h3>
          <NoteFeed />
        </div>
      </section>

      <section className='mt-6'>
        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>Instagram</h3>
          <InstagramFeed />
        </div>
      </section>

      <section className='mt-12'>
        <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm'>
          <h3 className='text-xl font-bold mb-3'>最新の更新フィード</h3>
          {latestAll.length === 0 ? (
            <p className='text-sm text-black/50'>更新はまだありません。</p>
          ) : (
            <ul className='space-y-2 text-sm'>
              {latestAll.map((g) => (
                <li key={g._id}>
                  <Link href={g.url} className='text-blue-700 hover:underline'>
                    [{EXAM_LABEL[g.exam as ExamKey]}] {g.title}
                  </Link>
                  {sortKey(g) > 0 && <span className='ml-2 text-black/40'>{new Date(sortKey(g)).toLocaleDateString('ja-JP')}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps<{ latestByExam: { qc: Guide[]; stat: Guide[]; engineer: Guide[] }; latestAll: Guide[] }> = async () => {
  const guides = allGuides.filter((g) => g.status !== 'draft');

  const byExam: Record<ExamKey, Guide[]> = { qc: [], stat: [], engineer: [] };
  for (const g of guides) {
    const ek = asExamKey(g.exam);
    if (ek) byExam[ek].push(g);
  }

  const pickN = (arr: Guide[], n: number) => [...arr].sort((a, b) => sortKey(b) - sortKey(a)).slice(0, n);

  const latestByExam = {
    qc: pickN(byExam.qc, 2),
    stat: pickN(byExam.stat, 2),
    engineer: pickN(byExam.engineer, 2),
  };

  const latestAll = [...guides].sort((a, b) => sortKey(b) - sortKey(a)).slice(0, 10);

  return { props: { latestByExam, latestAll } };
};

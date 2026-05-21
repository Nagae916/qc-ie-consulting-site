'use client';

import { useMemo } from 'react';
import {
  getManuscriptVolumeStatus,
  getRecommendedCharRange,
  splitTextToManuscriptPages,
} from '../../lib/manuscript';

type ManuscriptAnswerPreviewProps = {
  text: string;
  charsPerLine?: number;
  linesPerPage?: number;
  title?: string;
  targetPages?: number;
};

export default function ManuscriptAnswerPreview({
  text,
  charsPerLine = 24,
  linesPerPage = 25,
  title = '24字×25行 原稿用紙プレビュー',
  targetPages = 2,
}: ManuscriptAnswerPreviewProps) {
  const layout = useMemo(() => splitTextToManuscriptPages(text, charsPerLine, linesPerPage), [charsPerLine, linesPerPage, text]);
  const recommendedRange = getRecommendedCharRange(targetPages);
  const status = getManuscriptVolumeStatus(layout.bodyCharCount, targetPages);
  const isOverTargetPages = layout.estimatedPages > targetPages;
  const rowsPerPage = Array.from({ length: linesPerPage }, (_, rowIndex) => rowIndex);

  const statusClass =
    status === '適正'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === '超過'
        ? 'border-rose-200 bg-rose-50 text-rose-800'
        : 'border-amber-200 bg-amber-50 text-amber-800';

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          1ページ600字の答案用紙を想定した表示です。改行によって生じる空白マスも含め、答案用紙上の文字量感を確認できます。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard label="本文文字数" value={`${layout.bodyCharCount}字`} />
        <MetricCard label="原稿用紙上の使用マス数" value={`${layout.usedCellCount}マス`} />
        <MetricCard label="推定ページ数" value={`${layout.estimatedPages}ページ`} />
        <MetricCard label={`${targetPages}枚答案の推奨文字数`} value={`${recommendedRange.min}〜${recommendedRange.max}字`} />
      </div>

      <div className={`rounded-xl border px-4 py-3 text-sm font-bold ${statusClass}`}>
        現在の状態：{status}
      </div>

      {isOverTargetPages && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold leading-7 text-rose-800">
          {targetPages}枚答案の想定範囲を超えています。改行数または本文量を調整してください。
        </p>
      )}

      <div className="space-y-8">
        {layout.pages.map((page) => (
          <section key={page.pageNumber} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-800">ページ {page.pageNumber}</h4>
              <span className="text-xs font-semibold text-slate-500">
                {charsPerLine}字×{linesPerPage}行＝{layout.cellsPerPage}字
              </span>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[720px] space-y-0">
                {rowsPerPage.map((rowIndex) => {
                  const rowStart = rowIndex * charsPerLine;
                  const rowCells = page.cells.slice(rowStart, rowStart + charsPerLine);
                  return (
                    <div key={`${page.pageNumber}-${rowIndex}`} className="grid" style={{ gridTemplateColumns: `repeat(${charsPerLine}, minmax(0, 1fr))` }}>
                      {rowCells.map((char, columnIndex) => (
                        <span
                          key={`${page.pageNumber}-${rowIndex}-${columnIndex}`}
                          className="-ml-px -mt-px flex aspect-square min-h-7 items-center justify-center border border-slate-300 bg-white text-center text-sm leading-none text-slate-900"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

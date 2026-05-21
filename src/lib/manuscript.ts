export type ManuscriptPage = {
  pageNumber: number;
  cells: string[];
};

export type ManuscriptLayout = {
  normalizedText: string;
  bodyCharCount: number;
  usedCellCount: number;
  charsPerLine: number;
  linesPerPage: number;
  cellsPerPage: number;
  estimatedPages: number;
  pages: ManuscriptPage[];
};

export type ManuscriptVolumeStatus = '適正' | 'やや少ない' | '超過';

export function normalizeManuscriptText(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export function countManuscriptChars(text: string) {
  return Array.from(normalizeManuscriptText(text)).filter((char) => char !== '\n').length;
}

export function splitTextToManuscriptPages(text: string, charsPerLine = 24, linesPerPage = 25): ManuscriptLayout {
  const normalizedText = normalizeManuscriptText(text);
  const cellsPerPage = charsPerLine * linesPerPage;
  const manuscriptCells: string[] = [];

  for (const char of Array.from(normalizedText)) {
    if (char === '\n') {
      const currentColumn = manuscriptCells.length % charsPerLine;
      const blanksToNextLine = currentColumn === 0 ? charsPerLine : charsPerLine - currentColumn;
      for (let blankIndex = 0; blankIndex < blanksToNextLine; blankIndex += 1) {
        manuscriptCells.push('');
      }
      continue;
    }

    manuscriptCells.push(char);
  }

  const usedCellCount = manuscriptCells.length;
  const estimatedPages = Math.max(1, Math.ceil(Math.max(usedCellCount, 1) / cellsPerPage));
  const pages: ManuscriptPage[] = [];

  for (let pageIndex = 0; pageIndex < estimatedPages; pageIndex += 1) {
    const start = pageIndex * cellsPerPage;
    const end = start + cellsPerPage;
    const pageCells = manuscriptCells.slice(start, end);

    while (pageCells.length < cellsPerPage) {
      pageCells.push('');
    }

    pages.push({
      pageNumber: pageIndex + 1,
      cells: pageCells,
    });
  }

  return {
    normalizedText,
    bodyCharCount: countManuscriptChars(normalizedText),
    usedCellCount,
    charsPerLine,
    linesPerPage,
    cellsPerPage,
    estimatedPages,
    pages,
  };
}

export function getRecommendedCharRange(targetPages: number) {
  const safeTargetPages = Math.max(1, targetPages);
  return {
    min: 550 * safeTargetPages,
    max: 575 * safeTargetPages,
  };
}

export function getManuscriptVolumeStatus(bodyCharCount: number, targetPages: number): ManuscriptVolumeStatus {
  const range = getRecommendedCharRange(targetPages);

  if (bodyCharCount > range.max) return '超過';
  if (bodyCharCount < range.min) return 'やや少ない';
  return '適正';
}

import type { CollectionEntry } from 'astro:content';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Issue = CollectionEntry<'issues'>;
export type TocEntry = Issue['data']['toc'][number];

export const faNumber = (n: number) => n.toLocaleString('fa-IR');
export const pad2 = (n: number) => String(n).padStart(2, '0');

// In every issue the printed folio "01" (editor's note) sits on PDF page 4.
export const FOLIO_OFFSET = 3;
export const pdfPage = (folio: number) => folio + FOLIO_OFFSET;

export const issueLabel = (i: Issue) => `شماره‌ی ${faNumber(i.data.number)}`;
export const readUrl = (i: Issue, folio?: number) =>
  `/read/${i.id}${folio === undefined ? '' : `#p=${pdfPage(folio)}`}`;
export const pagesLabel = (e: TocEntry) =>
  e.to ? `${pad2(e.from)}–${pad2(e.to)}` : pad2(e.from);

export const sortIssues = (list: Issue[]) => [...list].sort((a, b) => b.data.number - a.data.number);

// PDFs are private and may be absent (fresh clone): return null instead of failing the build.
export function pdfInfo(i: Issue) {
  try {
    const rel = `../../public/magazine/${i.id}/${i.data.pdf}`;
    const bytes = statSync(fileURLToPath(new URL(rel, import.meta.url))).size;
    return { url: `/magazine/${i.id}/${i.data.pdf}`, mb: faNumber(Math.round(bytes / 1048576)) };
  } catch {
    return null;
  }
}

import type { CollectionEntry } from 'astro:content';

// Site-internal path -> URL under the deploy base (the site lives at /magazine-blog/ on GitHub Pages).
export const url = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`;

export type Issue = CollectionEntry<'issues'>;
export type TocEntry = Issue['data']['toc'][number];

export const faNumber = (n: number) => n.toLocaleString('fa-IR');
export const pad2 = (n: number) => String(n).padStart(2, '0');

// In every issue the printed folio "01" (editor's note) sits on PDF page 4.
export const FOLIO_OFFSET = 3;
export const pdfPage = (folio: number) => folio + FOLIO_OFFSET;

export const issueLabel = (i: Issue) => `شماره‌ی ${faNumber(i.data.number)}`;
export const readUrl = (i: Issue, folio?: number) =>
  url(`/read/${i.id}${folio === undefined ? '' : `#p=${pdfPage(folio)}`}`);
export const pagesLabel = (e: TocEntry) =>
  e.to ? `${pad2(e.from)}–${pad2(e.to)}` : pad2(e.from);

export const sortIssues = (list: Issue[]) => [...list].sort((a, b) => b.data.number - a.data.number);

// The PDFs are too large for GitHub Pages, so they are attached to the "issues" release.
const PDF_BASE = 'https://github.com/AmirhosseinAmadeh/magazine-blog/releases/download/issues';
export function pdfInfo(i: Issue) {
  return { url: `${PDF_BASE}/${i.data.pdf}`, mb: faNumber(Math.round(i.data.pdfBytes / 1048576)) };
}

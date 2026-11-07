import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One file per printed issue: src/content/issues/<NNN>.md (frontmatter only).
// Covers and page images live in public/magazine/<NNN>/; the PDFs are attached to the
// "issues" GitHub release (too large for GitHub Pages).
const issues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    number: z.number(),
    date: z.string(), // printed Jalali month + year, kept exactly as on the cover
    editor: z.string(),
    colorA: z.string(), // left cover band
    colorB: z.string(), // right cover band
    ink: z.string(), // interior background colour
    pages: z.number(),
    pdf: z.string(), // file name of the PDF, attached to the "issues" GitHub release
    pdfBytes: z.number(), // PDF size, shown on the download button
    toc: z.array(
      z.object({
        title: z.string(),
        from: z.number(), // printed folio; PDF page = folio + FOLIO_OFFSET
        to: z.number().optional(),
        kind: z.enum([
          'editorial', 'interview', 'members', 'news', 'game', 'book', 'puzzle',
          'ai', 'code', 'robot', 'data', 'report', 'culture', 'tech',
        ]),
        who: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { issues };

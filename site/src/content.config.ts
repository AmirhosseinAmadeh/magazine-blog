import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each issue is src/content/issues/<id>.md; its body is the editorial.
const issues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    theme: z.string(),
    date: z.coerce.date(),
    color: z.string().default('#b5432a'),
  }),
});

// Each article is single-language; `issue` is the id of its issue file.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    authorBio: z.string().optional(),
    lang: z.enum(['fa', 'en']),
    issue: z.string(),
    order: z.number().default(1),
    summary: z.string(),
  }),
});

export const collections = { issues, articles };

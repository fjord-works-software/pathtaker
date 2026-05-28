import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    // home
    intro_heading: z.string().optional(),
    intro_body: z.string().optional(),
    image_text_heading: z.string().optional(),
    // services
    page_heading: z.string().optional(),
    tagline: z.string().optional(),
    quote: z.string().optional(),
    // donate
    donate_heading: z.string().optional(),
    donate_intro: z.string().optional(),
    donate_disclaimer: z.string().optional(),
    paypal_button_id: z.string().optional(),
    donate_button_label: z.string().optional(),
  }),
});

export const collections = { team, pages };

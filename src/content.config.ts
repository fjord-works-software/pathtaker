import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string(),
    image_left: z.boolean().optional().default(true),
    order: z.number().optional().default(99),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    // board index
    page_intro: z.string().optional(),
    // home
    intro_heading: z.string().optional(),
    intro_body: z.string().optional(),
    image_text_heading: z.string().optional(),
    // services
    page_heading: z.string().optional(),
    tagline: z.string().optional(),
    quote: z.string().optional(),
    services: z.array(z.object({
      icon: z.string().optional(),
      name: z.string(),
      description: z.string(),
    })).optional(),
    approach_heading: z.string().optional(),
    approach_intro: z.string().optional(),
    modalities: z.array(z.string()).optional(),
    cta: z.string().optional(),
    // donate
    donate_heading: z.string().optional(),
    donate_intro: z.string().optional(),
    donate_disclaimer: z.string().optional(),
    paypal_button_id: z.string().optional(),
    donate_button_label: z.string().optional(),
    // contact
    access_key: z.string().optional(),
    subject: z.string().optional(),
    name_label: z.string().optional(),
    name_placeholder: z.string().optional(),
    email_label: z.string().optional(),
    email_placeholder: z.string().optional(),
    phone_label: z.string().optional(),
    phone_placeholder: z.string().optional(),
    message_label: z.string().optional(),
    message_placeholder: z.string().optional(),
    submit_label: z.string().optional(),
  }),
});

export const collections = { team, pages };

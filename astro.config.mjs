import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const BASE = (process.env.BASE_PATH || '/').replace(/\/+$/, '') + '/';

export default defineConfig({
  output: 'static',
  site: 'https://pathtaker.org',
  base: BASE,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

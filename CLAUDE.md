# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev:all    # Start Astro dev server + Sveltia/Decap CMS local backend together (use this for normal dev)
npm run dev        # Astro only (no CMS)
npm run dev:cms    # Decap local backend only
npm run build      # Production build (reads BASE_PATH env var)
npm run preview    # Preview the production build locally
```

The CMS admin is available at `/admin` when running `dev:all`.

## Architecture

**Static site**: Astro 6 with `output: 'static'`, deployed to GitHub Pages via `.github/workflows/deploy.yml`.

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.*` file). Custom design tokens are defined in `src/styles/global.css` inside `@theme {}`:
- `--color-cream`, `--color-brown`, `--color-brown-dark`
- `--font-family-body` (Figtree), `--font-family-heading` (Libre Baskerville)
- `--radius-pill`, `--letter-spacing-body`
- Global base styles set body font, heading font, and a CSS Grid body layout (`grid-template-rows: auto 1fr auto`)

**Content**: Astro Content Layer API (`getCollection`, `getEntry`, `render`). Two collections defined in `src/content.config.ts`:
- `pages` — single-file entries in `src/content/pages/` (home, services, contact, donate, board). All share one flat Zod schema with optional fields, so adding a new page field means updating both the schema and the markdown frontmatter.
- `team` — folder collection in `src/content/team/` with `create: true`. Each file generates a page at `/board/[slug]` via `src/pages/board/[slug].astro`. Fields: `name`, `title`, `photo`, `order` (nav sort), `image_left` (layout toggle).

**CMS**: Sveltia CMS (drop-in Decap CMS replacement) at `public/admin/`. Config is `public/admin/config.yml`. The `local_backend: true` flag enables local dev without OAuth. Production uses a Cloudflare Worker OAuth proxy (`base_url` in the backend config).

**Base path handling**: The build base is controlled by the `BASE_PATH` environment variable (set as a GitHub Actions repository variable). `astro.config.mjs` computes `base` from it, defaulting to `/` when unset. All internal links and asset `src` attributes must use the `url()` helper from `src/utils/url.ts` — never hardcode absolute paths like `/images/foo.jpg` or `/services` directly.

## Key Conventions

**Every internal `href` and asset `src`** must be wrapped: `url('/services')`, `url('/images/foo.jpg')`. The helper reads `import.meta.env.BASE_URL` at build time. Content-derived paths (e.g. `member.data.photo` from frontmatter) also need wrapping at the call site, not inside components.

**Heading fonts are global** — `h1`–`h6` already get `font-family: var(--font-family-heading)` from `global.css`. Don't add `font-heading` to heading elements. Do add it to non-heading elements (`<p>`, `<a>`, `<span>`) that need the serif font.

**Page layout pattern**: Each page `<main>` needs `w-full` alongside `max-w-*` and `mx-auto`. The CSS Grid body layout causes `mx-auto` without `w-full` to shrink-wrap content rather than fill the column.

**Adding a new CMS-editable field** requires three coordinated changes: the frontmatter in `src/content/pages/*.md`, the Zod schema in `src/content.config.ts`, and the field definition in `public/admin/config.yml`.

**Board member pages** are fully dynamic — adding a new `src/content/team/*.md` file (via CMS or manually) automatically generates a `/board/[slug]` page and adds the member to the header nav, sorted by the `order` field.

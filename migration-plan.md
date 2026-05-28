# Pathtaker.org — Shopify → Astro Static Site Migration Plan

## Context

Pathtaker.org currently runs on Shopify (Dawn theme 15.3.0). The site is a nonprofit informational site for a mental health intensive therapy provider — no e-commerce functionality is actually in use. The goal is to migrate to a clean static site stack (Astro + Tailwind + Decap CMS + Web3Forms) hosted on GitHub Pages, preserving the existing visual design for now with small tweaks to follow later.

**What gets dropped:** shopping cart, customer login/accounts, predictive search, Shopify analytics, payment scripts, newsletter subscription form, hCaptcha/Shopify form protection.

**What gets kept:** all page content and images, navigation structure (including Meet The Board dropdown), hero banner, image+text sections, contact form (via Web3Forms), privacy policy, social links (Instagram, TikTok), and the existing color palette and typography.

---

## Site Inventory

**Pages (9):**
| Route | Content |
|---|---|
| `/` | Hero banner + rich text intro + image+text section + collage |
| `/services` | Services page with therapy offerings and approach |
| `/contact` | Contact form (name, email, phone, message) |
| `/meet-the-board` | Board President bio + photo |
| `/meet-the-board/vice-president` | Vice President bio + photo |
| `/meet-the-board/secretary` | Secretary bio + photo |
| `/meet-the-board/treasurer` | Treasurer bio + photo |
| `/privacy-policy` | Privacy policy text |

**Navigation:**
```
Home | Services | Contact | Meet The Board ▾
                                ├─ Board President and CEO
                                ├─ Vice President
                                ├─ Secretary
                                └─ Treasurer
```
Footer: copyright, privacy policy link, Instagram, TikTok

**Design tokens to replicate:**
- Background: `#FDFBF6` (off-white)
- Primary/brand: `#72513C` (warm brown) — used for headings, buttons, accents
- Dark accent: `#562c1c` (deep brown) — used inline on services page
- Button border-radius: `40px` (pill)
- Input border-radius: `4px`
- Body font: Figtree (400, 700) — sans-serif
- Heading font: Libre Baskerville (400) — serif
- Body letter-spacing: `0.06rem`

**Images (copy from `pathtaker.org/cdn/shop/files/`):**
- `IMG_4614.jpg` — hero banner (1495×1000)
- `IMG_5073.jpg` — image+text section (portrait)
- `IMG_1185.jpg` — Board President
- `IMG_7917.jpg`, `IMG_2766.jpg`, `IMG_4884.jpg`, `Martin_Family_22-21.jpg` — other pages

---

## Target Project Structure

```
pathtaker/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro          # <html>, <head>, fonts, Tailwind
│   ├── components/
│   │   ├── Header.astro              # Sticky header + mobile drawer + dropdown
│   │   ├── Footer.astro              # Copyright, links, social icons
│   │   ├── HeroBanner.astro          # Full-width image banner
│   │   ├── ImageWithText.astro       # Side-by-side image + content block
│   │   ├── RichText.astro            # Centered text section (intro blurb)
│   │   └── ContactForm.astro         # Web3Forms contact form
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services.astro
│   │   ├── contact.astro
│   │   ├── privacy-policy.astro
│   │   └── meet-the-board/
│   │       ├── index.astro           # Board President
│   │       ├── vice-president.astro
│   │       ├── secretary.astro
│   │       └── treasurer.astro
│   └── content/
│       ├── config.ts                 # Astro content collections schema
│       └── team/
│           ├── president.md
│           ├── vice-president.md
│           ├── secretary.md
│           └── treasurer.md
├── public/
│   ├── images/                       # Copied from pathtaker.org/cdn/shop/files/
│   ├── fonts/                        # Figtree + Libre Baskerville woff2 files
│   └── admin/
│       ├── index.html                # Decap CMS entry point
│       └── config.yml                # Decap CMS collection definitions
├── .github/
│   └── workflows/
│       └── deploy.yml                # Build + deploy to GitHub Pages
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Phase 1 — Project Scaffold & Tooling

**Goal:** Working Astro + Tailwind project that builds and deploys to GitHub Pages.

1. Run `npm create astro@latest` inside the repo root (not inside `pathtaker.org/`), selecting the minimal/empty template with TypeScript.
2. Add Tailwind: `npx astro add tailwind`.
3. Configure `astro.config.mjs`:
   - `output: 'static'`
   - `site: 'https://pathtaker.org'`
   - `base: '/'`
4. Configure `tailwind.config.mjs` with the design token values (colors, font families, border-radius).
5. Add `@font-face` declarations in a global CSS file or `BaseLayout.astro` pointing to `/fonts/` in `public/`.
6. Copy font files from `pathtaker.org/cdn/fonts/figtree/` and `pathtaker.org/cdn/fonts/libre_baskerville/` → `public/fonts/`.
7. Create `.github/workflows/deploy.yml`:
   - Trigger: push to `main`
   - Steps: checkout → setup Node → `npm ci` → `npm run build` → deploy `dist/` to GitHub Pages using `actions/deploy-pages`
8. Enable GitHub Pages in repo settings (source: GitHub Actions).

**Verification:** Push to `main`, confirm the GitHub Actions workflow succeeds and `https://pathtaker.org` serves the Astro default page.

---

## Phase 2 — Layout & Component Library

**Goal:** Header, footer, and reusable section components that faithfully reproduce the existing visual design.

### BaseLayout.astro
- `<html lang="en">`, viewport meta, description slot, OG tags
- `<link rel="canonical">` per page
- Load fonts via `@font-face` (self-hosted from `/fonts/`)
- Background `#FDFBF6`, body font Figtree, heading font Libre Baskerville

### Header.astro
- Sticky header, centered logo text "Pathtaker" (Libre Baskerville)
- Inline nav (desktop ≥ 750px): Home, Services, Contact, Meet The Board with hover dropdown
- Mobile: hamburger button that opens a slide-in drawer nav
- No cart icon, no search icon, no account icon
- Social icons (Instagram, TikTok SVGs) in header icons area

### Footer.astro
- Single row: copyright `© 2026, Pathtaker` + privacy policy link
- Social icons

### HeroBanner.astro
- Full-width `<img>` with `object-fit: cover`, configurable height
- Optional centered overlay text

### ImageWithText.astro
- Two-column layout (image left, text right on desktop; stacked on mobile)
- Props: `image`, `alt`, `heading`, `body` (HTML slot or string)

### RichText.astro
- Centered max-width container
- Heading + body text, centered alignment

### ContactForm.astro
- Fields: Name, Email, Phone (optional), Message
- POST to `https://api.web3forms.com/submit` with hidden `access_key` input
- Client-side success/error state with a `<script>` tag (no framework needed)
- Styled with Tailwind to match existing form aesthetic (4px border-radius inputs, pill submit button)

**Verification:** Run `npm run dev`, visually compare header/footer against `pathtaker.org/index.html` in a browser side-by-side.

---

## Phase 3 — Page Migration

Migrate content page by page, extracting text from the existing HTML files in `pathtaker.org/pages/`.

### index.astro (Homepage)
Sections in order:
1. `<RichText>` — "Pathtaker is a 501(c)(3) nonprofit organization..."
2. `<ImageWithText>` — `IMG_5073.jpg` left, "Choose your setting..." text right
3. `<HeroBanner>` — `IMG_4614.jpg` full-width, no overlay text
4. Collage section (optional Phase 3 stretch: 3-column image grid using `IMG_7917`, `IMG_2766`, `Martin_Family_22-21`)

### services.astro
- Page title: "Services" (h0 heading, centered)
- H1: "Heal Deeply. Live Wholeheartedly." (brown)
- Hero image: `IMG_4884.jpg`
- Services list (4 items): Individual Intensive, Integrative Intensive, Wilderness Therapy, Backpacking Intensive
- Section: "Our Approach: Science Meets Soul" with modalities list
- CTA text: "Start your journey today."

### contact.astro
- Page title: "Contact"
- `<ContactForm>` component

### meet-the-board/index.astro, vice-president.astro, secretary.astro, treasurer.astro
- Each: image left + name/title/bio right using `<ImageWithText>`
- Photos: `IMG_1185.jpg` (president), assign other photos as appropriate

### privacy-policy.astro
- Page title: "Privacy Policy"
- Full policy text in a `<RichText>` container

**Copy images:** `pathtaker.org/cdn/shop/files/*.jpg` → `public/images/` (strip the `@v=...` query string from filenames).

**Verification:** `npm run dev`, navigate every page, confirm content matches source HTML.

---

## Phase 4 — Contact Form (Web3Forms)

1. Sign up at web3forms.com and get an access key tied to the org's email.
2. In `ContactForm.astro`, set the hidden `access_key` input value. Store the key in an environment variable `WEB3FORMS_ACCESS_KEY` and pass it via `Astro.env` or inline directly (it's a public key, safe to commit).
3. Add a `redirect` hidden input pointing to a `/thank-you` page, or use client-side JS to show an inline success message after fetch submit.
4. Optionally add Web3Forms' built-in hCaptcha by setting `<input type="hidden" name="botcheck">` (honeypot field).

**Verification:** Submit the form in dev/staging, confirm email is received at the configured address.

---

## Phase 5 — Decap CMS

**Goal:** Allow non-technical editors to update page content via a browser-based UI at `pathtaker.org/admin`.

### Backend configuration (`public/admin/config.yml`)
```yaml
backend:
  name: github
  repo: <org>/pathtaker   # replace with actual repo
  branch: main

media_folder: public/images
public_folder: /images

collections:
  - name: pages
    label: Pages
    files:
      - name: home
        label: Home Page
        file: src/content/pages/home.md
        fields:
          - { name: intro_heading, label: Intro Heading, widget: string }
          - { name: intro_body, label: Intro Body, widget: markdown }
          - { name: image_text_heading, label: Image Section Heading, widget: string }
          - { name: image_text_body, label: Image Section Body, widget: markdown }
      - name: services
        label: Services Page
        file: src/content/pages/services.md
        fields:
          - { name: page_heading, label: Page Heading, widget: string }
          - { name: body, label: Content, widget: markdown }
  - name: team
    label: Board Members
    folder: src/content/team
    create: false
    fields:
      - { name: name, label: Name, widget: string }
      - { name: title, label: Title, widget: string }
      - { name: photo, label: Photo, widget: image }
      - { name: bio, label: Bio, widget: markdown }
```

### Auth
- Register a GitHub OAuth app (Settings → Developer Settings → OAuth Apps)
- Callback URL: `https://pathtaker.org/admin`
- For GitHub Pages + Decap CMS without Netlify, use [Decap CMS's implicit OAuth flow](https://decapcms.org/docs/github-backend/) or a small OAuth proxy (e.g., `netlify-cms-github-oauth-provider` deployed on a free Render/Railway instance)

### Astro integration
- Astro content collections (`src/content/config.ts`) define schemas for `pages` and `team` collections
- Pages read their content via `getEntry()` and pass fields as props to components

**Verification:** Visit `pathtaker.org/admin`, log in with GitHub, edit a field, confirm a commit is created and the site rebuilds via GitHub Actions.

---

## Phase 6 — QA & Cutover

1. Cross-browser check (Chrome, Firefox, Safari, iOS Safari, Android Chrome)
2. Responsive check at 375px, 750px, 990px, 1280px breakpoints
3. Run Lighthouse on all pages — target 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO
4. Verify all internal links resolve correctly (no Shopify-era `/pages/` prefix issues)
5. Add `<meta name="robots" content="index, follow">` and sitemap via `@astrojs/sitemap`
6. Confirm `pathtaker.org` DNS points to GitHub Pages IPs (185.199.108-111.153)
7. Verify HTTPS certificate auto-provisioned by GitHub Pages
8. Keep `pathtaker.org/` (old Shopify export) in the repo as `pathtaker.org/` directory for reference — do not delete until cutover is confirmed

---

## Out of Scope (Future Tweaks)

- Visual redesign beyond faithful reproduction of existing look
- Blog or news section
- Donation/payment integration
- Google Analytics or other tracking
- Email newsletter

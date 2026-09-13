@AGENTS.md

# Project: enfineitz case-studies site

Jürgen's design portfolio / case-studies site, served at `case-studies.enfineitz.com`.

## Stack

- **Next.js 16.2.7** (App Router) + **React 19**, **TypeScript** (strict).
- **Tailwind CSS v4** (via `@tailwindcss/postcss`; config bridged with `@config` in `globals.css`).
- **Static export** — `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. The build emits plain HTML/CSS/JS to `/out`.
- Path alias: `@/*` → repo root (e.g. `@/components/Navigation`). This is the only alias.
- Fonts: IBM Plex Sans via `next/font/google`, plus Adobe Typekit ("heimat-stencil") injected in `app/layout.tsx`. Site is **always dark** — `dark` class is forced on `<html>`.

## Commands

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — static export to `/out`
- `npm run lint` — ESLint (`eslint-config-next`, flat config; ignores `out/**`)
- `npm run tokens` — regenerate design tokens (`scripts/sync-tokens.mjs`)

## Static-export constraints (important)

Because this is a static export, there is **no server runtime**. Do NOT add API routes, server actions, middleware, ISR, or SSR/`dynamic` data fetching. Everything must be renderable at build time. `next/image` optimization is off — size images manually.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` runs on GitHub Actions: `npm ci`, `npm run build`, then **rsync** `/out` to the VPS over SSH (secrets: `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_SSH_KEY`). Rsync uses `--delete` but excludes `.well-known/` and `.htaccess` so server-side config survives deploys. This is **not** Vercel or GitHub Pages — `README.md` is untouched `create-next-app` boilerplate and describes none of this project; ignore it entirely.

## Routes (`app/`)

| Route | Purpose |
| --- | --- |
| `/` (`app/page.tsx`) | Home — grid of `published` case-study cards. |
| `/bio` | Biography article — portrait, bio copy, certification badges. |
| `/enfineitz` | "What is Enfineitz?" manifesto, with rotating `ManifestoImage`. |
| `/case-study/[slug]` | Case-study template; `generateStaticParams()` emits one static page per published slug. |
| `/403`, `/408`, `/415`, `/500`, `/502`, `/503` | Plain static pages rendering `ErrorPage`. **Not** framework error handlers — Apache on the VPS serves them via `ErrorDocument` directives. |
| `app/not-found.tsx` | Next.js special file → static `404.html`. |
| `app/error.tsx` | Next.js client-side runtime error boundary (`'use client'`, has `reset()`). |

Every page shares the same shell: `GlobalHeader`, `Navigation`, `CornerDecoration`. Note the layout convention — pages render **both** a stacked mobile layout and a two-column desktop layout into the DOM, toggling between them with Tailwind `md:hidden` / `hidden md:flex` rather than restyling one tree.

## Components

- **CaseStudyCard** — home-grid card: cover image, title, summary, hover transitions.
- **CaseStudyContent** — renders a case study's `CaseStudyBlock[]` into markup; contains the `Figure` helper for aspect-ratio-safe `next/image`.
- **CornerDecoration** — inline-SVG corner bracket (4 positions), colored via `--accent-decorative-corner`.
- **CurrentYear** — hydration-safe live copyright year (build-time `from` prop, updates on mount).
- **ErrorPage** — shared shell for all error/status screens.
- **GlobalHeader** — top bar; on home it uses scroll-triggered reveal.
- **HomeRailGlyph** / **HomeRevealShift** — home left-rail pieces that cross-fade and shift in sync with the header reveal.
- **ManifestoImage** — client component; rotating captioned artwork for `/enfineitz`.
- **Navigation** — shared nav (page + social links); `display*` flags hide the current page's own link.
- **headerReveal.ts** — not a component. Exports `REVEAL_AT` / `revealTrigger()`, the single scroll-threshold source shared by the three reveal components. Kept in its own module so Fast Refresh isn't broken by a non-component export.

## Content model

Case studies are **content-driven, not hardcoded**:

- Each case study body is a JSON file of typed content blocks in `content/case-studies/*.json`.
- Block types are `hero`, `summary`, `gallery`, `section` — defined in `content/case-studies/contentMap.ts`, which also statically imports every case-study JSON and exposes `getCaseStudyContent(slug)`. A `section` block may omit `heading` to continue the preceding section.
- Index/list metadata lives in `content/case-studies.json`: `slug`, `title`, `pageTitle?`, `client`, `role`, `year`, `published`, `tags[]`, `coverImage`, `coverAlt`, `summary`, `ogImage?` (falls back to `/og/placeholder.png`).
- `published: false` removes a study from both the home grid and `generateStaticParams()` — it won't be built at all.
- Site/bio content also lives as JSON in `content/` (`bio.json`, `enfineitz.json`).

To add a case study, update **three** places: create `content/case-studies/<slug>.json`, add the import + map entry in `contentMap.ts`, and add metadata to `content/case-studies.json`. (Currently 10 studies, all registered in all three.)

## Design tokens

Source of truth is `tokens/enfineitz-tokens.json` (Token Studio / Figma export). `npm run tokens` flattens it, resolves `{ref}` references, and **overwrites two files**:

- `tailwind.config.js` — marked `AUTO-GENERATED — do not edit by hand`.
- `app/globals.css` — generated CSS vars, **plus a hand-authored footer** (`cssFooter` inside `sync-tokens.mjs`: social-icon masks, `.page-gradient`, `--identity-corner-clearance`). To change that hand-written CSS, edit `cssFooter` in the script, not `globals.css` directly — it gets regenerated.

Edit tokens in the JSON, never hardcode values in components. Only the `global/global` and `color roles/dark mode` + `light mode` groups are consumed; other groups in the file (`typography/Mode 1`, `grid/*`, `sizes/*`) are currently ignored by the script.

`.github/workflows/validate-tokens.yml` runs on PRs touching the token JSON, the sync script, or either generated file: it re-runs `npm run tokens` and fails if the committed `globals.css` / `tailwind.config.js` don't match. **Always commit regenerated output alongside token changes.**

## Assets

- `public/icons/` — brand glyph (rest/hover) + social icons, masked with `currentColor`.
- `public/og/` — per-case-study Open Graph images + shared `placeholder.png`.
- `public/images/` — case-study galleries, manifesto artwork, `errors/*.svg` numerals.
- Leftover `create-next-app` SVGs (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) are unused.
- `design/Enfineitz-2026.fig` — ~200MB Figma master file, untracked and not part of the build. `.vscode/mcp.json` wires up a Figma MCP server for pulling design data.

# Virtual Media Folders — promo site

Marketing site for the [Virtual Media Folders](https://wordpress.org/plugins/virtual-media-folders/) WordPress plugin and its add-ons. Built with [Astro](https://astro.build), deployed as a static site to Cloudflare Pages at **vmf.soderlind.no**.

## Stack

- **Astro** — static output, near-zero client JS
- **Cloudflare Pages** — hosting + cookieless Web Analytics
- **[@jdevalk/astro-seo-graph](https://www.npmjs.com/package/@jdevalk/astro-seo-graph)** — `<Seo>` head, connected schema.org `@graph`, build-time SEO checks, agent endpoints
- Build-time data hydration from the WordPress.org and GitHub APIs (see [ADR-0003](docs/adr/0003-build-time-data-hydration.md))

Design decisions are recorded in [CONTEXT.md](CONTEXT.md) and [docs/adr/](docs/adr/).

## SEO & agent-readiness

All metadata and structured data flow through `@jdevalk/astro-seo-graph`:

- **`<Seo>`** ([src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro)) renders title, description, canonical, Open Graph, Twitter, and the JSON-LD `@graph`.
- **Connected `@graph`** ([src/lib/schema.ts](src/lib/schema.ts)) — a shared `WebSite` + `Person`, a per-page `WebPage`, `BreadcrumbList`, and `SoftwareApplication` nodes for the plugin and each add-on, cross-referenced by stable `@id`.
- **Build-time validation** (in [astro.config.mjs](astro.config.mjs)) — flags missing/duplicate `<h1>`, duplicate titles/descriptions, missing `alt`, off-bounds metadata lengths, and internal links with trailing-slash mismatches or dead targets.
- **Agent endpoints**, all emitted statically:
  - `/schema/addons.json` — JSON-LD corpus for the add-ons
  - `/schemamap.xml` — schema discovery index
  - `/.well-known/api-catalog` — RFC 9727 API catalog
  - `/index.md`, `/add-ons.md`, `/add-ons/<slug>.md` — clean markdown alternates (linked via `<link rel="alternate" type="text/markdown">`)
  - `/llms.txt` — site summary for LLMs
- **Fuzzy 404** — [src/pages/404.astro](src/pages/404.astro) suggests the closest real URL via the sitemap.

> The build prints one intentional `WARN` that it stripped the markdown-alternate link from `404.html` — a 404 has no markdown representation, which is correct.

### IndexNow (optional)

IndexNow submission is wired but inert until you opt in:

1. Add a key route at `src/pages/<your-key>.txt.ts` using `createIndexNowKeyRoute({ key })` and deploy so `https://vmf.soderlind.no/<key>.txt` is reachable.
2. Set `INDEXNOW_KEY` in the Cloudflare Pages env. Submission runs only on the production branch (`CF_PAGES_BRANCH`) and only submits changed URLs (`incremental`).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
```

## Build

```sh
npm run build    # -> dist/
npm run preview  # serve the built site locally
```

The build fetches live figures (plugin version, install count, GitHub stars, add-on releases). If an API is unreachable it falls back to [`src/data/cache.json`](src/data/cache.json), so builds never break.

## Editing content

- **Marketing copy & links** — [`src/data/site.ts`](src/data/site.ts)
- **Add-on catalog** (source of truth) — [`src/data/addons.ts`](src/data/addons.ts)
- **Fallback figures** — [`src/data/cache.json`](src/data/cache.json)

Each add-on in `addons.ts` automatically gets a card, a category grouping on `/add-ons`, and a generated detail page at `/add-ons/<slug>`.

## Social image

`public/og-default.svg` is the source art. Generate the PNG referenced by the meta tags:

```sh
npx --yes sharp-cli -i public/og-default.svg -o public/og-default.png resize 1200 630
npx --yes sharp-cli -i public/favicon.svg -o public/apple-touch-icon.png resize 180 180
```

## Deploy — Cloudflare Pages (GitHub Actions + Wrangler)

Deployment is defined in-repo: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and runs `wrangler pages deploy dist` on every push to `main`, on pull requests (preview deploys), and on a **daily cron** that refreshes the build-time data. Project config lives in [wrangler.jsonc](wrangler.jsonc).

### One-time setup

1. **Authenticate Wrangler locally and create the project** (opens your browser):

   ```sh
   npx wrangler login
   npm run build
   npx wrangler pages project create virtual-media-folders-site --production-branch=main
   npx wrangler pages deploy dist --project-name=virtual-media-folders-site --branch=main
   ```

   The first deploy prints the live `*.pages.dev` URL.

2. **Attach the custom domain** — Cloudflare dashboard → Pages → the project → **Custom domains** → add `vmf.soderlind.no` (one click; DNS is already on Cloudflare).

3. **Add repo secrets** (GitHub → repo → Settings → Secrets and variables → Actions) so CI can deploy:
   - `CLOUDFLARE_API_TOKEN` — create at dash.cloudflare.com → My Profile → API Tokens → **Create Token** → *Cloudflare Pages: Edit* template.
   - `CLOUDFLARE_ACCOUNT_ID` — from any zone's overview, or `npx wrangler whoami`.
   - `PUBLIC_CF_ANALYTICS_TOKEN` *(optional)* — Cloudflare Web Analytics beacon token, to activate cookieless analytics.
   - `INDEXNOW_KEY` *(optional)* — see below.

After the secrets exist, pushing to `main` deploys automatically and the daily cron keeps the data fresh.

### IndexNow (optional)

See "IndexNow (optional)" above: add the key route, deploy so `https://vmf.soderlind.no/<key>.txt` is reachable, then set the `INDEXNOW_KEY` secret. Submission runs only on the `main` branch and only submits changed URLs.

## License

Site content © Per Søderlind. The plugin is GPL-2.0-or-later.

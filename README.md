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

## Deploy — Cloudflare Pages

1. Push this repo to `github.com/soderlind/virtual-media-folders-site`.
2. Cloudflare Pages → **Create project** → connect the repo.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add the custom domain **vmf.soderlind.no** (DNS is already on Cloudflare — one click).
4. **Analytics:** enable Cloudflare Web Analytics and set the site env var `PUBLIC_CF_ANALYTICS_TOKEN` to the beacon token to activate it.

### Scheduled rebuilds (keep data fresh)

Create a **Deploy Hook** in the Pages project, then trigger it on a schedule with a Cloudflare Worker Cron Trigger (e.g. daily) so the build re-fetches stars/version/add-on data:

```js
export default {
  async scheduled(_event, env) {
    await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  },
};
```

## License

Site content © Per Søderlind. The plugin is GPL-2.0-or-later.

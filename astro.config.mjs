import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import seoGraph, { indexNowOnBranch } from '@jdevalk/astro-seo-graph/integration';

const SITE_URL = 'https://vmf.soderlind.no';
const HOST = 'vmf.soderlind.no';

// IndexNow submits only when a key is set AND INDEXNOW_SUBMIT=true, on the
// production branch. Publish the key file first (deploy once with the key set but
// submission off), confirm /<key>.txt loads, then set INDEXNOW_SUBMIT — otherwise
// the first run can't verify the key and Cloudflare/Bing flag it invalid.
const indexNow =
  process.env.INDEXNOW_KEY && process.env.INDEXNOW_SUBMIT === 'true'
    ? indexNowOnBranch(process.env.CF_PAGES_BRANCH ?? '', {
        key: process.env.INDEXNOW_KEY,
        host: HOST,
        siteUrl: SITE_URL,
        incremental: true,
      })
    : undefined;

// https://astro.build
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    seoGraph({
      validateMetadataLength: {
        title: { min: 20, max: 70 },
        description: { min: 70, max: 200 },
      },
      markdownAlternate: true,
      llmsTxt: {
        title: 'Virtual Media Folders',
        siteUrl: SITE_URL,
        summary:
          'Virtual folders for the WordPress Media Library — no file moves, no broken URLs — plus nine free add-ons.',
      },
      ...(indexNow ? { indexNow } : {}),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});

// Sitemap-style discovery index for the site's schema endpoints.
import { createSchemaMap } from '@jdevalk/astro-seo-graph';
import { SITE } from '../data/site';

export const GET = createSchemaMap({
  siteUrl: SITE.url,
  entries: [{ path: '/schema/addons.json', lastModified: new Date() }],
});

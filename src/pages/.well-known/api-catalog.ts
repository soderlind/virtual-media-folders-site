// RFC 9727 API catalog — the standard discovery point for this site's APIs.
import { createApiCatalog } from '@jdevalk/astro-seo-graph';
import { SITE } from '../../data/site';

export const GET = createApiCatalog({
  siteUrl: SITE.url,
  schemaEndpoints: [
    { path: '/schema/addons.json', schemaType: 'SoftwareApplication' },
  ],
  schemaMap: { path: '/schemamap.xml' },
});

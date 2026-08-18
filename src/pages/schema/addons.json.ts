// Agent-ready JSON-LD @graph for the add-on corpus.
// Discoverable via /schemamap.xml and /.well-known/api-catalog.
import { createSchemaEndpoint } from '@jdevalk/astro-seo-graph';
import { buildWebPage, makeIds } from '@jdevalk/seo-graph-core';
import { ADDONS } from '../../data/addons';
import { SITE } from '../../data/site';
import { addonSoftwarePiece } from '../../lib/schema';

const ids = makeIds({ siteUrl: SITE.url });

export const GET = createSchemaEndpoint({
  entries: () => ADDONS,
  mapper: (addon) => {
    const url = `${SITE.url}/add-ons/${addon.slug}/`;
    return [
      buildWebPage(
        {
          url,
          name: `${addon.name} add-on`,
          description: addon.summary,
          isPartOf: { '@id': ids.website },
          inLanguage: 'en-US',
        },
        ids
      ),
      addonSoftwarePiece(addon, undefined, url, ids),
    ];
  },
});

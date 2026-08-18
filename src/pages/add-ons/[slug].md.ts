// Clean markdown representation of each add-on page for AI agents.
// Linked from <Seo> via <link rel="alternate" type="text/markdown">.
import { createMarkdownEndpoint } from '@jdevalk/astro-seo-graph';
import { ADDONS } from '../../data/addons';
import { SITE } from '../../data/site';

export const getStaticPaths = async () =>
  ADDONS.map((a) => ({ params: { slug: a.slug } }));

export const GET = createMarkdownEndpoint({
  entries: () => ADDONS,
  mapper: (addon, slug) =>
    addon.slug !== slug
      ? null
      : {
          frontmatter: {
            title: `${addon.name} — Virtual Media Folders add-on`,
            canonical: `${SITE.url}/add-ons/${addon.slug}/`,
            description: addon.summary,
          },
          body: [
            `# ${addon.name}`,
            '',
            `_${addon.tagline}_`,
            '',
            addon.description,
            '',
            '## Highlights',
            '',
            ...addon.features.map((f) => `- ${f}`),
            '',
            `Repository: https://github.com/soderlind/${addon.repo}`,
          ].join('\n'),
        },
});

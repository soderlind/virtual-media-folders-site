// Markdown representation of the home page for AI agents.
import type { APIRoute } from 'astro';
import { renderMarkdownAlternate } from '@jdevalk/astro-seo-graph';
import { SITE } from '../data/site';
import { ADDONS } from '../data/addons';

export const GET: APIRoute = () => {
  const { markdown, tokenCount } = renderMarkdownAlternate({
    frontmatter: {
      title: SITE.name,
      canonical: `${SITE.url}/`,
      description: SITE.description,
    },
    body: [
      `# ${SITE.name}`,
      '',
      SITE.description,
      '',
      '## Add-ons',
      '',
      ...ADDONS.map((a) => `- **${a.name}** — ${a.tagline}`),
    ].join('\n'),
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'max-age=300',
      'X-Robots-Tag': 'noindex, follow',
      'X-Markdown-Tokens': String(tokenCount),
    },
  });
};

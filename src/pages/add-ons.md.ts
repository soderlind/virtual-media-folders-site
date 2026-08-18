// Markdown representation of the add-ons index for AI agents.
import type { APIRoute } from 'astro';
import { renderMarkdownAlternate } from '@jdevalk/astro-seo-graph';
import { SITE } from '../data/site';
import { ADDONS, CATEGORIES } from '../data/addons';

export const GET: APIRoute = () => {
  const body: string[] = [
    '# Add-ons for Virtual Media Folders',
    '',
    'Nine free add-ons, installed and managed from the Add-On Manager.',
  ];
  for (const cat of CATEGORIES) {
    body.push('', `## ${cat.label}`, '');
    for (const a of ADDONS.filter((x) => x.category === cat.id)) {
      body.push(
        `- **${a.name}** — ${a.summary} (https://github.com/soderlind/${a.repo})`
      );
    }
  }

  const { markdown, tokenCount } = renderMarkdownAlternate({
    frontmatter: {
      title: 'Add-ons — Virtual Media Folders',
      canonical: `${SITE.url}/add-ons/`,
      description:
        'Nine free add-ons that extend Virtual Media Folders with AI, workflow, cleanup, migration, and search.',
    },
    body: body.join('\n'),
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

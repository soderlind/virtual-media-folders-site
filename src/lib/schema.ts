/**
 * schema.org @graph builders, powered by @jdevalk/seo-graph-core.
 *
 * Every page composes one connected graph: a shared WebSite + Person (publisher),
 * a per-page WebPage, an optional BreadcrumbList, and page-specific pieces such as
 * the SoftwareApplication nodes for the plugin and its add-ons. IDs are minted by a
 * single IdFactory so cross-references (author, isPartOf, breadcrumb) always resolve.
 */

import {
  makeIds,
  assembleGraph,
  buildWebSite,
  buildWebPage,
  buildBreadcrumbList,
  buildPiece,
} from '@jdevalk/seo-graph-core';
import { SITE } from '../data/site';
import type { Addon } from '../data/addons';
import type { PluginStats, AddonStats } from './data';

export type SchemaPiece = Record<string, unknown>;
export type Ids = ReturnType<typeof makeIds>;
export interface Crumb {
  name: string;
  url: string;
}

const PERSON_URL = 'https://profiles.wordpress.org/pers/';
const IN_LANGUAGE = 'en-US';
const PLUGIN_ID = `${SITE.url}/#software`;

/** Canonical URL for a page, computed the same way everywhere. */
export function canonicalOf(url: URL): string {
  return new URL(url.pathname, SITE.url).href;
}

export function makeSiteIds(): Ids {
  return makeIds({ siteUrl: SITE.url });
}

export function personPiece(ids: Ids): SchemaPiece {
  return buildPiece({
    '@type': 'Person',
    '@id': ids.person,
    name: SITE.author,
    url: PERSON_URL,
  }) as SchemaPiece;
}

export function pluginSoftwarePiece(stats: PluginStats, ids: Ids): SchemaPiece {
  return buildPiece({
    '@type': 'SoftwareApplication',
    '@id': PLUGIN_ID,
    name: SITE.name,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'WordPress',
    softwareVersion: stats.version,
    url: `${SITE.url}/`,
    downloadUrl: 'https://wordpress.org/plugins/virtual-media-folders/',
    author: { '@id': ids.person },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    ...(stats.numRatings > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (stats.rating / 20).toFixed(1),
            ratingCount: stats.numRatings,
            bestRating: '5',
          },
        }
      : {}),
  }) as SchemaPiece;
}

export function addonSoftwarePiece(
  addon: Addon,
  stats: AddonStats | undefined,
  canonical: string,
  ids: Ids
): SchemaPiece {
  return buildPiece({
    '@type': 'SoftwareApplication',
    '@id': `${canonical}#software`,
    name: `${addon.name} — Virtual Media Folders add-on`,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'WordPress',
    ...(stats?.version ? { softwareVersion: stats.version } : {}),
    url: canonical,
    downloadUrl: `https://github.com/soderlind/${addon.repo}`,
    author: { '@id': ids.person },
    isPartOf: { '@id': PLUGIN_ID },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: addon.summary,
  }) as SchemaPiece;
}

export interface PageGraphInput {
  canonical: string;
  name: string;
  description?: string;
  webPageType?: 'WebPage' | 'CollectionPage';
  breadcrumbs?: Crumb[];
  /** Page-specific pieces (e.g. SoftwareApplication nodes). */
  pieces?: (ids: Ids) => SchemaPiece[];
}

export function buildPageGraph(input: PageGraphInput): SchemaPiece {
  const ids = makeSiteIds();

  const website = buildWebSite(
    {
      url: `${SITE.url}/`,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': ids.person },
      inLanguage: IN_LANGUAGE,
    },
    ids
  );

  const webPage = buildWebPage(
    {
      url: input.canonical,
      name: input.name,
      ...(input.description ? { description: input.description } : {}),
      isPartOf: { '@id': ids.website },
      inLanguage: IN_LANGUAGE,
      ...(input.breadcrumbs
        ? { breadcrumb: { '@id': ids.breadcrumb(input.canonical) } }
        : {}),
    },
    ids,
    input.webPageType ?? 'WebPage'
  );

  const pieces: SchemaPiece[] = [personPiece(ids), website, webPage];

  if (input.breadcrumbs && input.breadcrumbs.length > 1) {
    pieces.push(
      buildBreadcrumbList(
        { url: input.canonical, items: input.breadcrumbs },
        ids
      ) as SchemaPiece
    );
  }

  if (input.pieces) pieces.push(...input.pieces(ids));

  return assembleGraph(pieces) as SchemaPiece;
}

/**
 * Build-time data hydration.
 *
 * Fetches live figures (plugin version/installs/rating, GitHub stars, add-on
 * releases) from the WordPress.org and GitHub APIs while the site is built, and
 * bakes them into static HTML. Every network call degrades gracefully to the
 * committed fallback in data/cache.json, so a flaky API never breaks the build
 * or shows empty numbers. See docs/adr/0003-build-time-data-hydration.md.
 */

import { ADDONS } from '../data/addons';
import fallback from '../data/cache.json';

export interface PluginStats {
  version: string;
  activeInstalls: number;
  rating: number; // 0–100
  numRatings: number;
  downloaded: number;
  stars: number;
}

export interface AddonStats {
  stars: number;
  version: string | null;
}

export interface SiteData {
  plugin: PluginStats;
  addons: Record<string, AddonStats>;
}

const WP_PLUGIN_SLUG = 'virtual-media-folders';
const GH_OWNER = 'soderlind';
const TIMEOUT_MS = 8000;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'vmf-promo-site (build)',
        Accept: 'application/json',
      },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchPluginStats(): Promise<PluginStats> {
  const fb = fallback.plugin;

  const info = await fetchJson<{
    version?: string;
    active_installs?: number;
    rating?: number;
    num_ratings?: number;
    downloaded?: number;
  }>(
    `https://api.wordpress.org/plugins/info/1.0/${WP_PLUGIN_SLUG}.json?fields=active_installs,rating,num_ratings,downloaded`
  );

  const repo = await fetchJson<{ stargazers_count?: number }>(
    `https://api.github.com/repos/${GH_OWNER}/${WP_PLUGIN_SLUG}`
  );

  return {
    version: info?.version ?? fb.version,
    activeInstalls: info?.active_installs ?? fb.activeInstalls,
    rating: info?.rating ?? fb.rating,
    numRatings: info?.num_ratings ?? fb.numRatings,
    downloaded: info?.downloaded ?? fb.downloaded,
    stars: repo?.stargazers_count ?? fb.stars,
  };
}

async function fetchAddonStats(repo: string): Promise<AddonStats> {
  const fb = (fallback.addons as Record<string, AddonStats>)[repo] ?? {
    stars: 0,
    version: null,
  };

  const [repoData, release] = await Promise.all([
    fetchJson<{ stargazers_count?: number }>(
      `https://api.github.com/repos/${GH_OWNER}/${repo}`
    ),
    fetchJson<{ tag_name?: string }>(
      `https://api.github.com/repos/${GH_OWNER}/${repo}/releases/latest`
    ),
  ]);

  return {
    stars: repoData?.stargazers_count ?? fb.stars,
    version: release?.tag_name ?? fb.version,
  };
}

let cached: Promise<SiteData> | null = null;

/** Memoized so all pages share one hydration pass per build. */
export function getSiteData(): Promise<SiteData> {
  if (cached) return cached;
  cached = (async () => {
    const [plugin, ...addonStats] = await Promise.all([
      fetchPluginStats(),
      ...ADDONS.map((a) => fetchAddonStats(a.repo)),
    ]);
    const addons: Record<string, AddonStats> = {};
    ADDONS.forEach((a, i) => {
      addons[a.repo] = addonStats[i];
    });
    return { plugin, addons };
  })();
  return cached;
}

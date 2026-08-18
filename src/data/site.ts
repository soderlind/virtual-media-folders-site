/**
 * Static site configuration and canonical marketing copy.
 * Numbers here are fallbacks; live figures are hydrated at build time (see lib/data.ts).
 */

export const SITE = {
  name: 'Virtual Media Folders',
  shortName: 'VMF',
  tagline: 'Virtual folders for the WordPress Media Library.',
  description:
    'Organize your WordPress Media Library into hierarchical virtual folders. No file moves, no broken URLs. Lightweight, accessible, and extensible with free add-ons.',
  url: 'https://vmf.soderlind.no',
  locale: 'en',
  author: 'Per Søderlind',
  themeColor: '#0a6ebd',
  ogImage: '/og-default.png',
} as const;

export const LINKS = {
  wporg: 'https://wordpress.org/plugins/virtual-media-folders/',
  wporgReviews:
    'https://wordpress.org/support/plugin/virtual-media-folders/reviews/',
  github: 'https://github.com/soderlind/virtual-media-folders',
  githubIssues: 'https://github.com/soderlind/virtual-media-folders/issues/new',
  addonManager: 'https://github.com/soderlind/vmfa',
  download:
    'https://github.com/soderlind/virtual-media-folders/releases/latest/download/virtual-media-folders.zip',
  playground:
    'https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/soderlind/virtual-media-folders/refs/heads/main/.wordpress-org/blueprints/blueprint.json',
  video: 'https://www.youtube.com/watch?v=bA4lf7ynz24',
  sponsor: 'https://paypal.me/PerSoderlind',
  docsDevelopment:
    'https://github.com/soderlind/virtual-media-folders/blob/main/docs/development.md',
  docsA11y:
    'https://github.com/soderlind/virtual-media-folders/blob/main/docs/a11y.md',
  docsAddon:
    'https://github.com/soderlind/virtual-media-folders/blob/main/docs/addon-development.md',
  docsMcp:
    'https://github.com/soderlind/virtual-media-folders/blob/main/docs/mcp.md',
} as const;

export const REQUIREMENTS = {
  wordpress: '6.8+',
  php: '8.3+',
} as const;

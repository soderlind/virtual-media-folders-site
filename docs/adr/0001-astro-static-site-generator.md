# Astro as the static site generator

We build the promo site with Astro, generating fully static HTML with zero JavaScript by default. Interactive bits (dark-mode toggle, lazy-loaded Playground/video) are opt-in islands.

## Context

"Lightweight" is the plugin's core selling point, so the site must embody it with a fast LCP and minimal JS. We also need maintainable content authoring for a landing page plus a page per add-on, and build-time data hydration from external APIs.

## Considered Options

- **Astro** (chosen) — ships zero JS by default, component + MDX authoring, trivial build-time `fetch()`, first-class Cloudflare adapter, islands only where needed.
- **Eleventy** — even leaner output but more manual work for 9 add-on pages + data merging.
- **Plain HTML/CSS** — ultimate control, but unmaintainable across 9 add-ons and live data.

## Consequences

The site can stay near-zero-JS while remaining maintainable. Contributors need Node/Astro tooling rather than editing raw HTML.

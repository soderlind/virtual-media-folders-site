# SEO and structured data via @jdevalk/astro-seo-graph

We render all metadata and structured data through `@jdevalk/astro-seo-graph` (with `@jdevalk/seo-graph-core`) rather than hand-rolling `<head>` tags and standalone JSON-LD blocks. Every page emits one connected schema.org `@graph`, and the integration runs build-time SEO checks plus agent-discovery endpoints.

## Context

The site targets both search engines and AI agents. Hand-written meta/JSON-LD drifts and produces disconnected schema nodes (no shared `@id` graph), and gives no build-time validation. The seo-graph toolkit provides a `<Seo>` component, `@id`-linked graph builders, H1/alt/metadata/internal-link validation, IndexNow, `llms.txt`, and markdown/schema endpoints for agents.

## Consequences

- Structured data is a single connected graph (WebSite + Person + WebPage + SoftwareApplication), not isolated snippets.
- Two extra dependencies, and a schema/canonical model coupled to this library's conventions.
- `trailingSlash: 'always'` is now enforced so internal links, canonicals, and markdown-alternate paths stay consistent (the integration warns on mismatches).
- Agent-facing routes (`/schema/*`, `/schemamap.xml`, `/.well-known/api-catalog`, `*.md`, `/llms.txt`) ship on every build.

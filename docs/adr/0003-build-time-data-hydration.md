# Build-time data hydration with cached fallback

Dynamic figures (plugin version, GitHub star count, add-on list/metadata) are fetched at build time from the WordPress.org and GitHub APIs and baked into static HTML — not fetched in the browser at runtime. A committed cache/fallback file supplies last-known values if an API is unavailable during a build.

## Context

Marketing copy is hand-authored, but numbers and the add-on roster should never go stale. Fetching at runtime would add client JS, latency, and CORS/rate-limit exposure, undermining the "lightweight" goal. Scheduled Cloudflare rebuilds (see ADR-0002) keep the baked data current.

## Consequences

The site stays zero-JS for data display and fast. Data is only as fresh as the last build, which the scheduled Deploy Hook mitigates. A failed API call degrades gracefully to cached values instead of breaking the build or showing empty figures.

# Cloudflare Pages hosting with scheduled CI rebuilds

The site is hosted on Cloudflare Pages, served at `vmf.soderlind.no`, whose DNS is already on Cloudflare. Deployment runs from GitHub Actions using Wrangler (`wrangler pages deploy`): every push to `main` builds and deploys, pull requests get preview deployments, and a daily scheduled workflow rebuilds the site to refresh build-time data.

## Context

We want zero-server hosting, free TLS, PR preview deployments, privacy-first analytics, and a way to keep build-time API data (stars, version, add-on info) fresh without a runtime backend. We also want the deploy pipeline itself to live in the repo (reviewable, reproducible) rather than as dashboard-only Git integration.

## Considered Options

- **GitHub Actions + Wrangler (chosen)** — pipeline is in-repo (`.github/workflows/deploy.yml`), the scheduled rebuild is a workflow `cron` (no separate Deploy Hook + Worker), and deploys use a scoped Cloudflare API token.
- **Dashboard Git integration** — simplest clicks, but the build/deploy config lives only in the Cloudflare dashboard and the OAuth connect step can't be scripted.

## Consequences

Attaching the `vmf.soderlind.no` custom domain is a one-step operation since DNS is already at Cloudflare. Analytics uses Cloudflare Web Analytics (cookieless), consistent with the plugin's no-tracking stance. Deploys require two repo secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`); the custom-domain attach is still a one-time dashboard/API step. Some lock-in to Cloudflare Pages conventions, accepted as a reasonable trade-off.

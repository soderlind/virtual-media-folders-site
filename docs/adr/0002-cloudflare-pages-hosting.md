# Cloudflare Pages hosting with scheduled rebuilds

The site is hosted on Cloudflare Pages via Git integration (push to `main` → build), served at `vmf.soderlind.no`, whose DNS is already on Cloudflare. A Cron-triggered Deploy Hook rebuilds the site on a schedule to refresh build-time data.

## Context

We want zero-server hosting, free TLS, PR preview deployments, privacy-first analytics, and a way to keep build-time API data (stars, version, add-on info) fresh without a runtime backend.

## Consequences

Attaching the `vmf.soderlind.no` custom domain is a one-step operation since DNS is already at Cloudflare. Analytics uses Cloudflare Web Analytics (cookieless), consistent with the plugin's no-tracking stance. Some lock-in to Cloudflare Pages conventions (Deploy Hooks, build config), accepted as a reasonable trade-off.

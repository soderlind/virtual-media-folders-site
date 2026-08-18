// Serves the IndexNow key-verification file at /<key>.txt.
// The key comes from the build env (INDEXNOW_KEY); no key set → route is skipped.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getIndexNowKeyFileContent } from '@jdevalk/seo-graph-core';

const KEY = process.env.INDEXNOW_KEY;

export const getStaticPaths = (() =>
  KEY ? [{ params: { key: KEY } }] : []) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(getIndexNowKeyFileContent(params.key ?? ''), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

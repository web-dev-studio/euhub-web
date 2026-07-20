// Custom server wrapper — same pattern as deploy's (euhub-deploy) server.mjs,
// which handles infra.euhub-ai.com -> deploy.euhub-ai.com the same way.
//
// Purpose: permanent 301 from the legacy hosts (web-dev-studio.com, the
// pre-rebrand home of "Web Dev Studio by EUHUB", and build.euhub-ai.com,
// the pre-consolidation canonical) to the canonical build.euhub.co.
// The redirect must sit in front of EVERYTHING because
// @astrojs/node's standalone handler serves files that exist under
// dist/client BEFORE invoking Astro's app/middleware pipeline — a redirect
// living only in src/middleware.ts would never fire for static assets
// requested on the legacy host.
//
// Azure Container Apps' ingress has no redirect facility of its own (it only
// routes bound hostnames to the app), so host-based redirects are the app's
// job — the legacy hostnames are bound to this same container app.
import http from 'node:http';

// Must be set before dist/server/entry.mjs is imported: in `standalone` mode
// that module auto-starts its own http.Server as an import side effect
// unless this env var opts out. We want its exported `handler` only.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler: astroHandler } = await import('./dist/server/entry.mjs');

const CANONICAL_SITE_URL = 'https://build.euhub.co';
const LEGACY_HOSTS = new Set([
  'web-dev-studio.com',
  'www.web-dev-studio.com',
  'build.euhub-ai.com',
]);

const server = http.createServer((req, res) => {
  const hostHeader = req.headers.host ?? '';
  const hostname = hostHeader.split(':')[0].toLowerCase();

  if (LEGACY_HOSTS.has(hostname)) {
    const target = new URL(req.url ?? '/', CANONICAL_SITE_URL);
    res.statusCode = 301;
    res.setHeader('Location', target.toString());
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end();
    return;
  }

  astroHandler(req, res);
});

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 8080);
server.listen(port, host, () => {
  console.log(`Build server listening on http://${host}:${port}`);
});

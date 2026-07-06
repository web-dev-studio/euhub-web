// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static-first: every page is prerendered to a static asset.
  // Only `src/pages/api/audit-request.ts` sets `export const prerender = false`
  // so it runs on the Cloudflare Workers runtime. This keeps HTML served from
  // edge cache (perf pitch), lets `public/_headers` apply to all pages, and
  // keeps the sitemap complete.
  output: 'static',
  adapter: cloudflare({
    // Transform images at build time only; avoids runtime Cloudflare Images cost.
    imageService: 'compile',
  }),
  site: 'https://web-dev-studio.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

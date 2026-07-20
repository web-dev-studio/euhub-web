// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static-first: every page is prerendered to a static asset.
  // Only `src/pages/api/audit-request.ts` sets `export const prerender = false`
  // so it runs on the Node server (Cloud Run). This keeps HTML served as
  // static assets (perf pitch) and the sitemap complete.
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  site: 'https://build.euhub.co',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-GB', sk: 'sk-SK' },
      },
    }),
  ],
  i18n: {
    locales: ['en', 'sk'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // Type-safe environment variables via astro:env.
  // Server secrets are read via `import { X } from 'astro:env/server'`
  // — never `import.meta.env` for runtime secrets.
  env: {
    schema: {
      WEBHOOK_URL: {
        type: 'string',
        context: 'server',
        access: 'secret',
        optional: true,
      },
      WEBHOOK_TOKEN: {
        type: 'string',
        context: 'server',
        access: 'secret',
        optional: true,
      },
      TURNSTILE_SECRET_KEY: {
        type: 'string',
        context: 'server',
        access: 'secret',
        optional: true,
      },
      PUBLIC_TURNSTILE_SITE_KEY: {
        type: 'string',
        context: 'client',
        access: 'public',
        optional: true,
      },
      PUBLIC_UMAMI_SCRIPT_URL: {
        type: 'string',
        context: 'client',
        access: 'public',
        optional: true,
      },
      PUBLIC_UMAMI_WEBSITE_ID: {
        type: 'string',
        context: 'client',
        access: 'public',
        optional: true,
      },
    },
  },
});

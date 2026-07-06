## Development

**Runtime:** Node 22+ (Node 24 LTS recommended) for running Astro commands.
**Package manager:** Bun (`bun install`, `bun add`). Lockfile: `bun.lock`.

Bun is the package manager; Node is the Astro runtime (Bun's runtime doesn't
yet support `module.registerHooks` which Astro 7 requires).

### Commands

```bash
# Install dependencies
bun install

# Dev server (background mode per AGENTS convention)
npm run dev
# or: astro dev --background  (then: astro dev stop / status / logs)

# Build (static output to ./dist)
npm run build

# Preview the built site
npm run preview

# Type checking
npm run check    # astro check

# Format
npm run format         # write
npm run format:check   # check only
```

### Architecture decisions

- `output: "static"` — every page is prerendered; only `src/pages/api/audit-request.ts` sets `prerender = false` (runs on Cloudflare Workers).
- Cloudflare Workers deployment (not Pages — the `@astrojs/cloudflare` adapter removed Pages support in v14).
- Secrets via `astro:env` or `Astro.locals.runtime.env` — never `import.meta.env` for runtime secrets.
- `PUBLIC_` prefix required for client-exposed env vars (Turnstile site key, Umami).
- Inter self-hosted via Fontsource (no Google Fonts CDN — GDPR exposure).
- No MDX, no GSAP-global, no 3D. React islands only where interactivity is necessary.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

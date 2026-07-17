# Web Dev Studio by EUHUB

Premium web development studio landing page for `web-dev-studio.com`, part of
the EUHUB engineering ecosystem. Fast, secure, conversion-focused, GDPR-aware.

## Stack

- **Astro 7** — static-first, `output: "static"`, one dynamic API route
- **GCP Cloud Run** — deployment via `@astrojs/node` (standalone mode)
- **React 19** — islands only (form, hero interactive elements)
- **TypeScript** — strict mode
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **Plus Jakarta Sans / DM Sans / JetBrains Mono** — self-hosted via Fontsource
  (no Google Fonts CDN); the shared EUHUB type system (grow + deploy + build)
- **Zod 4** — shared validation schema (client + server)
- **Bun** — package manager (`bun install`)
- **Node 22+** — Astro runtime (Bun's runtime doesn't support `module.registerHooks`)

## Quick start

```bash
bun install          # install dependencies
npm run dev          # start dev server
npm run build        # build to ./dist/
npm run preview      # preview the built site locally
npm run check        # type checking (astro check)
npm run format       # format with Prettier
```

## Environment variables

Copy `.env.example` to `.env` for local development. On GCP Cloud Run,
secrets are stored in GCP Secret Manager and mounted as env vars at runtime.

| Variable                    | Context       | Purpose                           |
| --------------------------- | ------------- | --------------------------------- |
| `WEBHOOK_URL`               | server secret | Destination for form submissions  |
| `WEBHOOK_TOKEN`             | server secret | Optional bearer token for webhook |
| `TURNSTILE_SECRET_KEY`      | server secret | Cloudflare Turnstile verification |
| `PUBLIC_TURNSTILE_SITE_KEY` | client        | Turnstile widget rendering        |
| `PUBLIC_UMAMI_SCRIPT_URL`   | client        | Umami analytics script URL        |
| `PUBLIC_UMAMI_WEBSITE_ID`   | client        | Umami website ID                  |

**Cloudflare Turnstile test keys** (for local dev / CI — always pass):

- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

## Architecture

### Static-first

Every page is prerendered to a static asset. Only
`src/pages/api/audit-request.ts` sets `export const prerender = false` so it
runs on the Node server (Cloud Run). This keeps:

- HTML served as static assets (performance)
- Sitemap complete (all routes included)

### Secrets

Server-side secrets are read via `astro:env/server` (type-safe). Never use
`import.meta.env` for runtime secrets — they're inlined at build time and
won't exist in the Cloud Run environment.

### Contact form

- 4 required fields (name, email, project type, message) + 7 optional
- Honeypot + Cloudflare Turnstile (client widget + server-side verification)
- Webhook POST with 8s timeout (AbortController), non-2xx handling
- `mailto:` fallback in the error state
- Rate limiting: in-memory counter (per-instance)
- Dev mode: returns success with console warning if `WEBHOOK_URL` is unset

### Analytics

- Umami Cloud (EU/Frankfurt region) — cookieless, no consent banner required
- Custom events: CTA clicks, form start/submit, service card clicks, FAQ opens,
  ecosystem link clicks, email clicks, scroll depth (50% and 90%)
- Scroll depth and form-start tracking require custom listeners (in BaseLayout)

### Security headers

- Set via Astro middleware (`src/middleware.ts`) on all responses
- CSP includes Turnstile and Umami domains — update if using a custom Umami domain
- HSTS intentionally omitted until the canonical domain is live on HTTPS
- `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)

## Deployment

### GCP Cloud Run (via GitHub Actions)

The deploy workflow (`.github/workflows/deploy.yml`) runs on push to `main`:

1. Quality gates (format, typecheck, build, content guard)
2. i18n translation completeness check (when SK content changes)
3. Build Docker container (multi-stage: Bun+Node build, Node slim runtime)
4. Push to GCP Artifact Registry
5. Deploy to Cloud Run with secrets from GCP Secret Manager

**Required GitHub secrets** (in `prod` environment):

| Secret                            | Purpose                                                 |
| --------------------------------- | ------------------------------------------------------- |
| `GCP_WIF_PROVIDER`                | Workload Identity Federation provider URL               |
| `GCP_SA_EMAIL`                    | GCP service account email for auth                      |
| `GCP_PROJECT_ID`                  | GCP project ID                                          |
| `GAR_LOCATION`                    | Artifact Registry location (e.g. `europe-west1`)        |
| `GAR_REPOSITORY`                  | Artifact Registry repository name                       |
| `CR_SERVICE_NAME`                 | Cloud Run service name                                  |
| `CR_LOCATION`                     | Cloud Run region (e.g. `europe-west1`)                  |
| `PUBLIC_TURNSTILE_SITE_KEY`       | Turnstile site key (client)                             |
| `PUBLIC_UMAMI_SCRIPT_URL`         | Umami script URL (client)                               |
| `PUBLIC_UMAMI_WEBSITE_ID`         | Umami website ID (client)                               |
| `GCP_WEBHOOK_URL_SECRET`          | GCP Secret Manager secret name for WEBHOOK_URL          |
| `GCP_WEBHOOK_TOKEN_SECRET`        | GCP Secret Manager secret name for WEBHOOK_TOKEN        |
| `GCP_TURNSTILE_SECRET_KEY_SECRET` | GCP Secret Manager secret name for TURNSTILE_SECRET_KEY |

**GCP Secret Manager secrets** (must be created before first deploy):

```bash
gcloud secrets create WEBHOOK_URL --replication-policy=automatic
echo -n "your-webhook-url" | gcloud secrets versions add WEBHOOK_URL

gcloud secrets create WEBHOOK_TOKEN --replication-policy=automatic
echo -n "your-token" | gcloud secrets versions add WEBHOOK_TOKEN

gcloud secrets create TURNSTILE_SECRET_KEY --replication-policy=automatic
echo -n "your-secret" | gcloud secrets versions add TURNSTILE_SECRET_KEY
```

### Manual deploy (without GitHub Actions)

```bash
npm run build
docker build -t euhub-web-dev-studio .
docker run -p 8080:8080 \
  -e WEBHOOK_URL=... \
  -e TURNSTILE_SECRET_KEY=... \
  -e PUBLIC_TURNSTILE_SITE_KEY=... \
  euhub-web-dev-studio
```

## Performance targets

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+

The site itself is the proof — see the "Self-referential proof" section.

## Accessibility

- Semantic HTML with proper heading hierarchy
- Keyboard navigation with visible focus states
- Skip-to-content link
- `prefers-reduced-motion` respected (animations disabled)
- No hover-only essential information
- Mobile menu accessible by keyboard (Escape to close)
- Form labels and ARIA where necessary
- Sufficient color contrast

## Legal

- `/privacy/` — Privacy Policy
- `/cookies/` — Cookie Policy
- `/terms/` — Terms of Service

Legal content is interim and must be reviewed by legal counsel against the
actual deployment (Umami Cloud EU, Cloudflare, webhook host) before launch.

## Project structure

```
src/
  components/
    layout/      # Header, Footer
    sections/    # 13 landing page sections
    ui/          # Button, Card, Container, Section, Badge, Icon
    forms/       # AuditRequestForm (React island)
  content/       # Typed content files (services, process, FAQ, etc.)
  layouts/       # BaseLayout, LegalLayout
  pages/         # index, 404, privacy, cookies, terms, api/audit-request
  styles/        # global.css (Tailwind v4 + tokens + scroll-reveal)
  lib/           # validation.ts, analytics.ts
public/          # _headers, _redirects, robots.txt, favicon, site.webmanifest
docs/            # Source prompt, reviews, conversion architecture
```

## Definition of Done

See `docs/conversion-architecture.md` and the plan reviews in `docs/` for the
full DoD checklist. CI gates (Playwright smoke test + Lighthouse CI) are
required before merge to `main`.

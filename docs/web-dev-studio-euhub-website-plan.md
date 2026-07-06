# Build Plan v2 — Web Dev Studio by EUHUB

Source prompt: `docs/web-dev-studio-euhub-website-prompt.md`
Review applied: `docs/web-dev-studio-build-plan-review.md` (all 17 points adopted)
Status: greenfield — only `.gitignore` + `docs/` + one initial commit.

This plan is the source of truth. The site is a **proof-of-competence artifact**: if it claims performance, security, API integration, GDPR awareness, and engineering maturity, the site itself must prove those things.

## Resolved decisions

| Fork                  | Choice                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Framework             | Astro (latest stable, pinned) + React islands + TypeScript strict                                              |
| Styling               | Tailwind CSS v4 (Vite plugin)                                                                                  |
| Animation             | CSS by default → Motion for React islands → GSAP only if a section truly requires it (lazy-loaded per-section) |
| 3D (Three/Spline/R3F) | Not included                                                                                                   |
| Package manager       | Bun (`bun.lockb`)                                                                                              |
| Runtime floor         | Node 22 LTS documented in `.nvmrc`                                                                             |
| Deployment            | Cloudflare Pages (`@astrojs/cloudflare`)                                                                       |
| Astro output mode     | `output: "server"` — API route requires it; Web-API-only in server code (no Node APIs)                         |
| Contact form backend  | Astro server endpoint → env-driven webhook, with timeout / non-2xx / structured errors / no internal leaking   |
| Spam protection       | Honeypot + Cloudflare Turnstile (client + server-side verification) + IP/UA rate-limit strategy                |
| Analytics             | Umami (cookieless → no consent banner); event layer as a thin adapter                                          |
| i18n                  | EN canonical and published; SK **not exposed** until real copy exists; switch shows "SK — Coming soon"         |
| Theme                 | Light theme only                                                                                               |
| Case studies          | Renamed to **Example Project Scenarios**, clearly labelled as examples                                         |
| Primary CTA           | "Request Web Audit"                                                                                            |
| Secondary CTA         | "See What We Build" / "View Services"                                                                          |
| Tertiary CTA          | "Explore EUHUB AI"                                                                                             |
| Sections              | 13 (prompt's 12 + Engagement Models)                                                                           |

## Stack & integrations

- Astro (pinned) + `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/cloudflare`
- React (islands only) + TypeScript strict
- Tailwind CSS v4 (Vite plugin)
- Motion for React (island microinteractions)
- GSAP — only if justified, lazy-loaded per-section (not global)
- Content in typed TS files under `src/content/`
- **No MDX** unless a concrete long-form use case appears later

## Folder structure

```
src/
  components/
    layout/      # Header, Footer, SkipLink, LanguageSwitch
    sections/    # Hero, Problem, Services, Differentiation, Process, TechStack,
                 # ExampleScenarios, EngagementModels, Ecosystem, CTA, FAQ
    ui/          # Button, Card, GlassPanel, Container, Section, Badge, Icon
    animations/  # Motion wrappers, scroll-reveal helpers
    forms/       # AuditRequestForm, form fields, validation
  content/
    site.ts          # nav, SEO meta, contact, en locale
    services.ts
    process.ts
    tech-stack.ts
    example-scenarios.ts
    engagement-models.ts
    faq.ts
    ecosystem.ts
    legal.ts         # privacy/cookies/terms content blocks + TODO markers
  layouts/
  pages/
    index.astro
    privacy.astro
    cookies.astro
    terms.astro
    api/
      audit-request.ts
  styles/
  lib/
    analytics.ts     # Umami event adapter
    i18n.ts          # locale helpers; en canonical
    validation.ts    # form schema + server validation
  assets/
public/
  _headers           # Cloudflare security headers
  _redirects
  robots.txt
  og.png             # placeholder
astro.config.mjs
.nvmrc               # 22
bun.lockb
.env.example
AGENTS.md
README.md
.github/workflows/ci.yml
```

## Phase order (content drives layout)

### Phase 0 — Business & conversion architecture

Define before any code:

- **Personas**: Founder/owner, Operations manager, Marketing manager, Technical decision-maker
- **Conversion path**: Visitor → Audit request → Qualification → Discovery call → Proposal
- **Offer hierarchy**: Technical Web Audit → Landing Page → Business Website → Website Redesign → Custom Web App → Client Portal → Internal Dashboard → AI Interface → API/CRM/ERP Integration → Maintenance/DevOps Retainer
- **Trust signals**: EU-based, Slovakia/EU, GDPR-aware, engineering-led, API/backend/DevOps competence, legacy incl. SOAP
- **Measurable events**: cta_primary_click, cta_secondary_click, audit_form_start, audit_form_submit_success, audit_form_submit_error, service_card_click, faq_open, ecosystem_link_click, email_click, scroll_50, scroll_90
- **Section-to-conversion mapping**:
  1. Hero — who it's for + outcome → primary CTA
  2. Problem — urgency
  3. Services — map needs to offers
  4. Differentiation — prove engineering-led, not template shop
  5. Process — reduce perceived risk
  6. Tech Stack — prove engineering depth
  7. Example Scenarios — proof-like context (labelled)
  8. Engagement Models — pre-qualify on scope/budget
  9. EUHUB Ecosystem — credibility via parent brands
  10. CTA + Form — low-friction first step (primary conversion event)
  11. FAQ — remove residual objections
  12. Footer — legal + ecosystem links

### Phase 1 — Technical scaffolding

- `bun create astro@latest` (minimal, TS strict)
- Add integrations: `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/cloudflare`
- Tailwind v4 via Vite plugin + base tokens (color/type — non-layout, safe to define early)
- `astro.config.mjs`: `output: "server"`, site URL, Cloudflare adapter, sitemap integration
- `.nvmrc` → `22`; `bun.lockb` committed
- ESLint + Prettier + `astro check`
- `AGENTS.md`: lint / typecheck / astro check / build commands (Bun-prefixed)
- `README.md` skeleton, `.env.example`:
  ```env
  SITE_URL=
  WEBHOOK_URL=
  TURNSTILE_SITE_KEY=
  TURNSTILE_SECRET_KEY=
  UMAMI_SCRIPT_URL=
  UMAMI_WEBSITE_ID=
  ```

### Phase 2 — Content model & copy (real EN, prompt's tone)

- `content/site.ts` — nav, SEO meta, contact, EN locale canonical
- `content/services.ts` — 7 services
- `content/process.ts` — 5 steps + deliverables
- `content/tech-stack.ts` — 5 categories
- `content/example-scenarios.ts` — 3 realistic before/after, labelled "Example"
- `content/engagement-models.ts` — 6 engagement models + pricing-orientation copy
- `content/faq.ts` — 10 items + engagement/pricing orientation items
- `content/ecosystem.ts` — 4 EUHUB brands
- `content/legal.ts` — privacy/cookies/terms content blocks with TODO markers for legal review
- i18n-ready: content keyed by locale, `en` populated; `sk` **not routed**
- Tone: direct, premium, technical, no clichés, no lorem ipsum, no fake claims

### Phase 3 — Design system

- Tailwind tokens: warm-white/off-white surfaces, EU-tech blue + cyan/violet accent, green/amber for status only
- Strong modern sans-serif type scale
- UI primitives: `Button`, `Card`, `GlassPanel`, `Container`, `Section`, `Badge`, `Icon`
- Layout shell: sticky `Header` (nav + primary CTA + EN/SK switch where SK = "Coming soon"), `Footer`, skip-to-content link, focus-visible styles, `prefers-reduced-motion` hooks

### Phase 4 — Core layout & 13 sections

1. **Header** — wordmark, nav (Services, Work, Process, Tech Stack, FAQ, Contact), CTA, EN/SK switch (SK disabled), EUHUB.CO / EUHUB AI links
2. **Hero** — headline + subheadline, primary/secondary CTA, trust line, browser mockup with floating API/AI/dashboard/performance cards (Motion island)
3. **Problem** — "Your website is probably not the real problem. The system behind it is."
4. **Services** — 7 cards, hover interactions desktop-only, technical icons, no React
5. **Differentiation** — "Design is only the visible layer." + 5-layer stack visual
6. **Process** — 5 steps, scroll-reveal (CSS/Motion first; GSAP only if needed, lazy-loaded)
7. **Tech Stack** — categorized grid, not a logo wall
8. **Example Project Scenarios** — 3 before/after cards, clearly labelled "Example", not "case studies"
9. **Engagement Models** — 6 models + pricing-orientation copy
10. **EUHUB Ecosystem** — 4 brand cards
11. **CTA + Contact form** — audit offer copy + accessible qualifying form
12. **FAQ** — 10+ items, native `<details>` accordion (no React)
13. **Footer** — wordmark, description, nav, ecosystem links, contact email, location (Slovakia/EU), Privacy/Cookie/Terms, copyright

**React island rules (strict):**

- Hero interactive visual: React island ✓
- Contact form: React island ✓
- FAQ accordion: native `<details>`, no React
- Static cards: no React
- Header mobile menu: minimal client script, React only if justified

### Phase 5 — Contact form & backend

- **Fields**: Name, Company, Work email, Current website, Company size, Project type (enum), Main problem, Budget range (enum), Timeline (enum), Decision role (enum), Message
- Project type enum: Technical Web Audit, Landing Page, Business Website, Website Redesign, Custom Web Application, Client Portal, Internal Dashboard, AI-integrated Web Interface, API/CRM/ERP Integration, Maintenance/DevOps, Not sure yet
- Budget enum: < €2,500 / €2,500–€5,000 / €5,000–€10,000 / €10,000–€25,000 / €25,000+ / Not sure yet
- Timeline enum: ASAP / Within 1 month / 1–3 months / 3–6 months / Just researching
- Decision role enum: Owner/Founder / Technical decision-maker / Marketing/Growth / Operations / Project manager / Other
- Accessible labels, client + server validation (shared schema in `lib/validation.ts`)
- Honeypot + **Cloudflare Turnstile** (client widget + server-side verify)
- `src/pages/api/audit-request.ts`:
  - Validate input (shared schema)
  - Verify Turnstile token server-side via Web `fetch`
  - POST JSON to `import.meta.env.WEBHOOK_URL` with timeout, non-2xx handling, structured errors
  - **No leaking of webhook internals to the user**
  - Basic IP/User-Agent rate-limit strategy
  - Return clean success/error JSON
- Client states: idle, submitting, success, error
- Clear integration placeholder if `WEBHOOK_URL` unset (dev mode returns success with a logged warning)

### Phase 6 — SEO, metadata & legal pages

- Per-page `<head>`: title, description, OG title/desc, OG image, Twitter/X card, canonical
- JSON-LD: `Organization` + `ProfessionalService`
- `sitemap.xml` (`@astrojs/sitemap`), `robots.txt`
- Semantic HTML + heading hierarchy
- Keyword mapping from prompt (primary + secondary), no stuffing
- Legal pages: `/privacy/`, `/cookies/`, `/terms/` — real placeholder content with editable blocks + TODO markers for legal review; no fake legal claims
- Cookie banner: **not added** — Umami is cookieless; document this decision in README. Banner only added if a later tool requires non-essential cookies.

### Phase 7 — Animation & interaction

- CSS transitions by default
- Motion islands: hero floating cards, animated counters (visibility-triggered), example-scenario cards
- GSAP ScrollTrigger: only if process timeline needs advanced control; lazy-loaded on that section only; never global
- All gated behind `prefers-reduced-motion`
- No heavy animation on mobile; no scroll hijacking; no parallax overload

### Phase 8 — Analytics, security, performance, accessibility

- **Analytics (Umami, cookieless)**:
  - `lib/analytics.ts` thin adapter wrapping Umami's `data-umami-event` / script
  - Events: cta_primary_click, cta_secondary_click, audit_form_start, audit_form_submit_success, audit_form_submit_error, service_card_click, faq_open, ecosystem_link_click, email_click, scroll_50, scroll_90
  - Script loaded via Astro with proper attribute; no consent banner needed
- **Security headers** (`public/_headers`):
  ```
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```
  - CSP finalized after external domains known (Umami host, Turnstile, webhook, fonts, assets)
- **Performance**: Astro `<Image>` + modern formats, lazy-load heavy assets, no CLS, small JS payload, static rendering where possible
- **Accessibility audit**: keyboard nav, visible focus, form labels, color contrast, no hover-only info, accessible mobile menu, alt text, skip link, heading hierarchy
- **Target Lighthouse**: Performance 95+, Accessibility 95+, Best Practices 95+, SEO 95+ (mobile + desktop)

### Phase 9 — Docs, CI, deployment, QA

- **CI** (`.github/workflows/ci.yml`):
  - `bun install --frozen-lockfile`
  - `bun run format:check`
  - `bun run lint`
  - `bun run typecheck`
  - `bun run astro check`
  - `bun run build`
  - Optional: Playwright smoke, Lighthouse CI, link checker, HTML validation
- **Cloudflare Pages**: build command `bun run build`, output `.dist`/`dist` per adapter, env vars set in dashboard, Bun available in build env
- **Finalize README**: setup, env vars, deploy notes, perf notes, a11y notes, analytics/cookie decision, maintenance notes
- **Final QA**: Lighthouse run (mobile + desktop), manual keyboard walkthrough, reduced-motion walkthrough, form success/error/timeout walkthrough with test webhook

## Definition of Done

- [ ] Production build passes
- [ ] No TypeScript errors
- [ ] `astro check` passes
- [ ] Lighthouse targets met on mobile **and** desktop (95+ all categories)
- [ ] Contact form validates; handles success / error / timeout states
- [ ] Webhook integration verified against a test endpoint
- [ ] Turnstile verification works server-side
- [ ] Site is fully keyboard navigable
- [ ] `prefers-reduced-motion` works
- [ ] No lorem ipsum; no fake claims; no fake client logos
- [ ] Metadata + JSON-LD validate
- [ ] `sitemap.xml` + `robots.txt` generated
- [ ] Security headers configured (`_headers`)
- [ ] Legal pages exist (`/privacy/`, `/cookies/`, `/terms/`) with TODO markers for legal review
- [ ] Umami events fire for all listed conversions
- [ ] SK routes not exposed; language switch shows "Coming soon"
- [ ] README covers setup, deploy, env vars, QA, maintenance
- [ ] CI workflow green on main

## Implementation rules (from prompt + review)

- No bloated animation; no unnecessary dependencies (no MDX, no GSAP-global, no 3D)
- No lorem ipsum; no fake customer results; no fake case studies
- Light theme only; no dark cyberpunk
- No inaccessible hover-only interactions
- No stock-photo-heavy design; no generic agency template
- No ignored mobile performance
- No hardcoded secrets; no broken form logic; no silent webhook failures
- No skipped SEO metadata; no skipped README; no skipped security headers
- Static content stays static — React only where interactivity is necessary

## Open items blocking production polish

**Required before launch:**

- Real contact email
- Legal company name + registration details (if needed) + VAT ID (if needed)
- Privacy/Cookie/Terms content (or legal review sign-off on placeholders)
- Final canonical domain decision
- Final EUHUB.CO / EUHUB AI / EUHUB.SK URLs
- Real OG image
- Umami instance URL + website ID
- Turnstile site key + secret
- Webhook destination URL
- Notification recipient email
- Real address/location wording
- Real examples or permission to publish (to replace Example Scenarios)

**Nice to have:**

- Real client logos / testimonials / performance screenshots
- Real audit sample PDF
- Calendly/booking integration
- CRM integration

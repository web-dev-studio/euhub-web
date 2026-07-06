# Web Dev Studio by EUHUB — Build Plan Review & Improvement Suggestions

Review target: **Build Plan — Web Dev Studio by EUHUB**  
Context: greenfield Astro/React/Tailwind/Cloudflare landing page project  
Goal: improve the plan from “buildable” to properly production-grade and conversion-aware.

---

## Executive Verdict

The build plan is strong from an engineering structure perspective, but weaker from a business and conversion perspective.

### Score

| Area                         | Rating | Comment                                                                                                   |
| ---------------------------- | -----: | --------------------------------------------------------------------------------------------------------- |
| Engineering structure        |   8/10 | Clean, logical, mostly production-minded                                                                  |
| Business/conversion strategy | 6.5/10 | Not enough focus on lead quality, buyer objections, and conversion events                                 |
| Production readiness         |   7/10 | Good foundation, but missing security headers, CI details, legal pages, analytics, and Definition of Done |

### Summary

The plan is good enough to build.

It is not yet sharp enough to sell.

The biggest problem: it plans components, sections, tooling, and animations better than it plans the actual buyer journey.

A web-dev studio website is not just a website. It is a proof-of-competence artifact. If it claims performance, security, API integration, GDPR awareness, and engineering maturity, the site itself must prove those things.

---

## Main Issues Found

1. Too much implementation detail before conversion strategy.
2. “Latest stable” is not reproducible enough.
3. Astro + Cloudflare backend mode needs sharper definition.
4. Contact form needs stronger qualification, validation, anti-spam, and error handling.
5. MDX may be unnecessary.
6. GSAP may be overkill.
7. SK stub routes should not be publicly exposed.
8. Fake or illustrative case studies should be renamed.
9. Analytics plan is missing.
10. Security headers are missing.
11. Legal page handling is underplanned.
12. CI/CD details are not explicit enough.
13. Definition of Done is missing.

---

# Detailed Review

## 1. Add Business and Conversion Architecture Before Scaffolding

The current plan starts with technical scaffolding. That is natural for engineers and slightly tragic for businesses.

Before writing code, define how the page converts visitors into leads.

### Add Phase 0

```md
### Phase 0 — Business and Conversion Architecture

- Define primary visitor personas:
  - Founder / owner
  - Operations manager
  - Marketing manager
  - Technical decision-maker

- Define main conversion path:
  - Visitor
  - Audit request
  - Qualification
  - Discovery call
  - Proposal

- Define offer hierarchy:
  - Technical Web Audit
  - Landing Page
  - Business Website
  - Custom Web Application
  - AI-ready Interface
  - Maintenance / DevOps Retainer

- Define trust signals:
  - EU-based
  - Slovakia / EU location
  - GDPR-aware
  - Engineering-led
  - API/backend/DevOps competence
  - Legacy integration capability, including SOAP

- Define measurable events:
  - CTA clicks
  - Form submits
  - Outbound ecosystem clicks
  - Service interest clicks
  - FAQ opens
  - Scroll depth

- Define lead qualification fields:
  - Budget
  - Timeline
  - Project type
  - Current website
  - Business problem
  - Decision role
```

### Why this matters

A polished site without conversion architecture is just expensive decoration with responsive breakpoints.

---

## 2. Add a Clear Conversion Architecture Section

The plan lists page sections, but does not explain how they work together to convert.

### Add this section

```md
### Conversion Architecture

Define the visitor journey:

1. Hero explains who this is for and what outcome they get.
2. Problem section creates urgency.
3. Services section maps business needs to offers.
4. Differentiation section proves EUHUB is engineering-led, not a template shop.
5. Process section reduces perceived project risk.
6. Example scenarios provide proof-like context.
7. CTA section offers a low-friction first step: Request Web Audit.

Primary conversion event:

- Submitted audit request form

Secondary conversion events:

- Clicked EUHUB AI
- Clicked email
- Clicked service card
- Opened FAQ item
- Scrolled to contact section
```

---

## 3. Replace “Latest Stable” With Pinned Versions

The plan says:

```md
Astro latest stable
```

That is fine for brainstorming, but weak for reproducible builds.

### Replace with

```md
Use pinned dependency versions in `package.json`.
Do not use floating major versions.
After scaffolding, commit the lockfile immediately.
Document the exact Node.js version in `.nvmrc` or `.tool-versions`.
```

### Recommended runtime decision

```text
Node.js: >= 22 LTS
Package manager: pnpm or npm, choose one and document it
```

### Recommendation

Use `pnpm` if the project may grow. Use `npm` if you want fewer moving parts for non-engineers.

Do not leave package management ambiguous. That is how projects become dependency archaeology.

---

## 4. Clarify Astro + Cloudflare Runtime Mode

The plan includes:

```md
Astro server endpoint → env-driven webhook
Cloudflare Pages (`@astrojs/cloudflare`)
```

Good direction, but it needs more precision.

If the project includes an API endpoint, it is not purely static anymore. That is acceptable, but the Astro output mode and Cloudflare runtime limitations must be planned.

### Add this

```md
Astro output mode:

- Use `output: "server"` or hybrid rendering depending on final route requirements.
- Confirm Cloudflare adapter compatibility with the API endpoint.
- Avoid Node-only APIs in server code because Cloudflare runtime is Web API based.
- Use `fetch`, Web Crypto, and standard Request/Response APIs.
```

### Webhook requirements

```md
Webhook requirements:

- Timeout handling
- Non-2xx response handling
- Structured error messages
- No leaking webhook internals to the user
- Server-side validation
- Spam protection
- Rate limiting strategy
- Optional email notification fallback
```

A form that silently fails is not a lead-generation system. It is a decorative hole in the floor.

---

## 5. Improve the Contact Form for Lead Qualification

The current form fields are useful, but too soft.

Original fields:

```md
- Name
- Company
- Work email
- Current website
- What do you need?
- Budget range
- Timeline
- Message
```

### Recommended fields

```md
Fields:

- Name
- Company
- Work email
- Current website
- Company size
- Project type
- Main problem
- Budget range
- Timeline
- Decision role
- Message
```

### Recommended project type options

```text
Technical Web Audit
Landing Page
Business Website
Website Redesign
Custom Web Application
Client Portal
Internal Dashboard
AI-integrated Web Interface
API / CRM / ERP Integration
Maintenance / DevOps
Not sure yet
```

### Recommended budget ranges

```text
< €2,500
€2,500–€5,000
€5,000–€10,000
€10,000–€25,000
€25,000+
Not sure yet
```

### Recommended timeline options

```text
ASAP
Within 1 month
1–3 months
3–6 months
Just researching
```

### Recommended decision role options

```text
Owner / Founder
Technical decision-maker
Marketing / Growth
Operations
Project manager
Other
```

---

## 6. Add Cloudflare Turnstile

The plan says:

```md
honeypot + optional captcha
```

For Cloudflare Pages, the obvious production choice is Cloudflare Turnstile.

### Replace with

```md
Spam protection:

- Honeypot field
- Cloudflare Turnstile
- Server-side Turnstile verification
- Basic IP/user-agent rate limiting strategy
```

### Add environment variables

```env
WEBHOOK_URL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
SITE_URL=
```

Captcha should not be optional if the form goes to a real webhook. Webhook spam is not character-building. It is just garbage with headers.

---

## 7. Reconsider Motion + GSAP Together

The plan includes:

```md
Motion for React + GSAP
```

This can work, but it risks unnecessary bundle weight and complexity.

### Add an animation dependency rule

```md
Animation dependency rule:

- Use CSS transitions by default.
- Use Motion only for React island microinteractions.
- Use GSAP only if the process timeline or hero animation cannot be implemented cleanly with CSS/Motion.
- Lazy-load GSAP only on sections that need it.
- Do not include GSAP globally.
```

### Specific recommendation

Change:

```md
GSAP ScrollTrigger: process timeline reveal
```

To:

```md
Prefer CSS/Motion for timeline reveal.
Use GSAP ScrollTrigger only if the final interaction requires advanced timeline control.
Lazy-load GSAP on that section only.
```

A simple fade-in should not require summoning an animation framework like a small front-end exorcism.

---

## 8. Be Strict About React Islands

Astro is useful because it ships less JavaScript by default. Do not accidentally rebuild Next.js inside Astro because the component folder got lonely.

### Add rules

```md
React island usage rules:

- Hero interactive visual: React island allowed
- Contact form: React island allowed
- FAQ accordion: preferably native HTML/details or tiny vanilla component
- Static cards: no React
- Header mobile menu: minimal client script or React only if justified
```

### Recommended principle

Static content should stay static.

Use React only where interactivity is necessary.

---

## 9. Remove MDX Unless There Is a Real Use Case

The plan includes:

```md
@astrojs/mdx
```

But the content model uses typed TypeScript files.

That is enough for a landing page.

### Replace with

```md
Use typed TS content files for landing page sections.
Use Astro Content Collections only if adding case study detail pages, blog posts, or long-form resources.
Do not add MDX unless there is a concrete content use case.
```

Dependencies are not trophies. They cost maintenance.

---

## 10. Fix the i18n Strategy

The current plan says:

```md
EN copy now, SK-ready routing/content structure (no SK translation yet)
```

This is okay internally, but dangerous if exposed publicly.

### Replace with

```md
i18n-ready: content keyed by locale, `en` populated.
Do not expose `/sk/` routes until real Slovak copy exists.
Language switch may show SK as disabled or “Coming soon.”
EN is canonical initially.
Avoid indexable placeholder translation pages.
```

Half-empty translated pages are not internationalization. They are SEO litter with a flag icon.

---

## 11. Rename “Case Studies” Until Real Proof Exists

The plan says:

```md
3 case studies, labelled illustrative
```

This is risky. Even when labelled, fake case studies can feel fake.

### Replace

```md
Case Studies
```

With:

```md
Example Project Scenarios
```

### Updated section rule

```md
Use “Example Project Scenarios” until real case studies exist.
Do not call them case studies unless based on real work.
Clearly label them as realistic examples.
Replace with real client stories when available.
```

This avoids looking like a company that invented clients because the design template had three cards.

---

## 12. Add Engagement Models or Pricing Orientation

The plan lacks a pricing or engagement model section.

You do not need public fixed prices, but you do need orientation.

### Add section or FAQ block

```md
### Engagement Models

1. Technical Web Audit
2. Landing Page Build
3. Business Website Redesign
4. Custom Web Application
5. AI-ready Interface
6. Maintenance & DevOps Retainer

Copy:
We price based on scope, integrations, timeline, and long-term maintenance requirements. Most serious projects start with a technical audit or discovery phase.
```

This helps filter leads before they reach the form.

---

## 13. Add Analytics Plan

The website talks about analytics, but the implementation plan does not include analytics.

That is not ideal. Mildly hypocritical, even.

### Add

```md
Analytics:

- Privacy-friendly analytics preferred
- Track form submit success/failure
- Track CTA clicks
- Track service card clicks
- Track FAQ engagement
- Track outbound ecosystem links
- Track scroll depth
- Do not load analytics before consent if legally required
```

### Recommended tools

```text
Plausible
Umami
PostHog EU cloud/self-hosted
Google Analytics only if consent flow is properly handled
```

### Suggested events

```text
cta_primary_click
cta_secondary_click
audit_form_start
audit_form_submit_success
audit_form_submit_error
service_card_click
faq_open
ecosystem_link_click
email_click
scroll_50
scroll_90
```

---

## 14. Plan Legal Pages Properly

The footer mentions:

```md
Privacy / Cookie / Terms
```

But the plan does not confirm whether these pages exist.

### Add

```md
Legal pages:

- `/privacy/`
- `/cookies/`
- `/terms/`

Initially create clear placeholder legal pages with editable content blocks.
Do not publish fake legal claims.
Add TODO markers where legal review is needed.
```

### Cookie banner rule

```md
Cookie banner:

- Only required if non-essential cookies/tracking are used.
- If using privacy-friendly cookieless analytics, document that.
- Do not add a cookie banner unnecessarily.
```

Do not add a cookie banner just because every website wants to impersonate a government form.

---

## 15. Add Security Headers

A production site needs basic security headers.

### Add Cloudflare `_headers`

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Add planning note

```md
Security headers:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security, if served over HTTPS
```

CSP should be finalized after external domains are known, including analytics, fonts, Turnstile, webhook target, and assets.

---

## 16. Make CI/CD Explicit

The plan mentions linting and checks, but CI is not explicit enough.

### Add CI checks

```md
CI checks:

- Install dependencies from lockfile
- Format check
- Lint
- Typecheck
- `astro check`
- Production build
```

### Optional advanced checks

```md
Optional:

- Playwright smoke test
- Lighthouse CI
- Link checker
- HTML validation
```

### Suggested GitHub Actions workflow

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm astro check
      - run: pnpm build
```

Adjust package manager if using npm.

---

## 17. Add Definition of Done

This is one of the biggest missing pieces.

The plan says what to build, but not how to know when it is done.

### Add

```md
## Definition of Done

The project is complete when:

- Production build passes
- No TypeScript errors
- `astro check` passes
- Lighthouse targets are met on mobile and desktop
- Contact form validates and handles success/error states
- Webhook integration works with test endpoint
- Turnstile verification works server-side
- Site is keyboard navigable
- Reduced motion mode works
- No placeholder lorem ipsum exists
- No fake claims or fake logos exist
- Metadata and JSON-LD validate
- Sitemap and robots.txt are generated
- Security headers are configured
- Legal pages exist, even if marked for legal review
- README includes setup, deploy, env vars, QA, and maintenance notes
```

Without Definition of Done, every project becomes “almost finished,” which is just unfinished with better posture.

---

# Improved Phase Order

The current phase order is okay, but this order is stronger:

```md
Phase 0 — Business and conversion architecture
Phase 1 — Technical scaffolding
Phase 2 — Content model and copy
Phase 3 — Design system
Phase 4 — Core layout and sections
Phase 5 — Contact form and backend
Phase 6 — SEO, metadata, legal pages
Phase 7 — Animation and interaction
Phase 8 — Analytics, security, performance, accessibility
Phase 9 — Docs, CI, deployment, QA
```

### Why move content before design system?

Content drives layout.

Otherwise you design elegant empty boxes and then torture the copy until it fits. That is not strategy. That is visual furniture arrangement.

---

# Specific Replacements

## Replace MDX integration unless needed

### Current

```md
@astrojs/mdx
```

### Better

```md
Add `@astrojs/mdx` only if long-form editable content is needed.
```

---

## Replace GSAP-first timeline assumption

### Current

```md
GSAP ScrollTrigger: process timeline reveal
```

### Better

```md
Prefer CSS/Motion for timeline reveal.
Use GSAP ScrollTrigger only if the final interaction requires advanced timeline control.
Lazy-load GSAP on that section only.
```

---

## Replace SK stub routing

### Current

```md
i18n-ready: content keyed by locale, `en` populated, `sk` stubbed
```

### Better

```md
i18n-ready: content keyed by locale, `en` populated.
Do not expose SK routes until real SK copy exists.
Language switch may show SK as disabled/coming soon.
```

---

## Replace illustrative case studies

### Current

```md
Case Studies — 3 before/after cards, labelled illustrative
```

### Better

```md
Example Project Scenarios — 3 realistic before/after cards, clearly labelled as examples until replaced by real case studies.
```

---

## Replace optional captcha

### Current

```md
honeypot + optional captcha
```

### Better

```md
honeypot + Cloudflare Turnstile + server-side validation + rate-limit strategy
```

---

# Improved Open Items

The current open items are too polite and incomplete.

### Replace with this

```md
## Open items blocking production polish

Required before launch:

- Real contact email
- Legal company name
- Company registration details, if needed
- VAT ID, if needed
- Privacy policy content
- Cookie policy decision based on analytics/tracking
- Terms content
- Final canonical domain decision
- Final EUHUB ecosystem URLs
- Real OG image
- Analytics provider decision
- Turnstile site key and secret
- Webhook destination
- Notification recipient
- Real address/location wording
- Real examples or permission to publish case studies

Nice to have:

- Real client logos
- Real testimonials
- Real performance screenshots
- Real audit sample PDF
- Calendly/booking integration
- CRM integration
```

---

# Business Reality Check

The website itself becomes proof of the studio’s competence.

| Claim            | Site must prove                                             |
| ---------------- | ----------------------------------------------------------- |
| Fast websites    | Lighthouse and perceived speed must be excellent            |
| Secure systems   | Headers, validation, spam protection                        |
| API integrations | Contact form webhook must be real and clean                 |
| AI-ready         | Architecture and service copy must explain actual use cases |
| GDPR-aware       | Analytics, cookies, and legal handling must be serious      |
| Premium design   | No generic template smell                                   |
| Engineering-led  | Codebase must be clean and maintainable                     |

If the site is slow, vague, overanimated, full of placeholders, or legally sloppy, it undermines the entire offer.

The landing page is not just marketing. It is a live demo.

---

# Final Corrected Verdict

The original plan is buildable and mostly sane.

To make it production-grade, fix these points:

1. Add Phase 0 for business and conversion architecture.
2. Pin dependency versions and document Node/package manager.
3. Clarify Astro output mode for Cloudflare server endpoints.
4. Strengthen contact form qualification.
5. Add Cloudflare Turnstile and server-side verification.
6. Use GSAP only if truly needed.
7. Keep React islands limited.
8. Remove MDX unless there is a real use case.
9. Do not expose SK routes until real Slovak content exists.
10. Rename illustrative “case studies” to “example project scenarios.”
11. Add engagement models or pricing orientation.
12. Add analytics tracking plan.
13. Add legal pages.
14. Add security headers.
15. Add explicit CI/CD checks.
16. Add Definition of Done.
17. Improve open items before production launch.

After those corrections, the plan becomes much closer to a serious production blueprint instead of a polished engineering checklist that forgot humans buy things.

---

# Recommended Next Action

Patch the original build plan with:

- `Phase 0 — Business and Conversion Architecture`
- `Definition of Done`
- `Analytics`
- `Security Headers`
- `Legal Pages`
- `Cloudflare Turnstile`
- `Improved Open Items`
- Revised i18n, MDX, GSAP, and case-study decisions

Then give that updated plan to the coding agent as the source of truth.

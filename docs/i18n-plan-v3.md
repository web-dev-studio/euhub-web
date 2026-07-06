# i18n Plan v3 — Slovak (SK) Language Support

Source: i18n-plan-v2.md + Codex review (`docs/i18n-plan-v2-review.md`)
Status: all 4 Codex points adopted. v2 is superseded.

Review history:

- v1 → Fable 5 review (14 points, all adopted into v2)
- v2 → Codex review (4 points, all adopted into v3)
- v3 = implementation-ready

## Resolved decisions

| Fork                            | Choice                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| URL structure                   | `/sk/` prefix for SK, EN stays at root (`prefixDefaultLocale: false`)                                              |
| Translation source              | AI-generated Slovak, no human review (user choice — risk flagged in R1/R2)                                         |
| Auto-redirect                   | Client-side script auto-redirects Slovak browsers to `/sk/`                                                        |
| Form enum values                | Stable IDs + translated display labels; webhook receives IDs only (no backwards-compat hedge — no consumer exists) |
| SK scope                        | Full SK: homepage, 404, privacy, cookies, terms                                                                    |
| EN og:locale / sitemap          | `en_GB` / `en-GB` (valid BCP-47; `en_EU` was invalid)                                                              |
| Missing-translation check scope | Runs only when `src/content/sk/**` files change                                                                    |

## Risk register

| #   | Risk                                                                                 | Severity     | Mitigation                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | AI Slovak copy may be grammatically incorrect, wrong register (vykanie), or off-tone | **High**     | DoD gate: SK copy reviewed by a Slovak speaker before `/sk/` goes live. Enforced via **CODEOWNERS** (merge-blocking, not just a checklist) + PR template.                                                       |
| R2  | AI-translated legal pages are a legal liability under Slovak law                     | **Critical** | DoD gate: SK legal pages reviewed by Slovak legal counsel. Enforced via **CODEOWNERS** on `**/legal.ts` (merge-blocking) + GitHub issue template with front matter. SK legal pages get their own `lastUpdated`. |
| R3  | Client-side auto-redirect can cause loops or confuse search engines                  | Medium       | Strict guard conditions (§6). hreflang + canonical are the primary SEO signal; JS redirect is a UX enhancement.                                                                                                 |
| R4  | ~~Form enum refactor breaks webhook contract~~                                       | ~~Medium~~   | **Resolved:** no webhook consumer exists. Ship stable IDs cleanly. No dual-field hedge.                                                                                                                         |
| R5  | Partial translations create "SEO litter"                                             | Medium       | SK routes only added when 100% of in-scope content is translated. Completeness check runs when SK files change.                                                                                                 |

---

## 1. Architecture

### 1.1 Astro i18n config

```js
// astro.config.mjs addition
i18n: {
  locales: ['en', 'sk'],
  defaultLocale: 'en',
  routing: {
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false,
  },
},
```

`Astro.currentLocale` resolves correctly on every prerendered route in Astro 7, including the asymmetric root-vs-`/sk/` case. **No manual fallback** — use `getContent(Astro.currentLocale)` directly.

### 1.2 Content structure — per-locale bundle files

**CRITICAL:** The current content files export multiple separate named consts (`site.ts` exports `site`, `primaryCta`, `secondaryCta`, `tertiaryCta`, `trustLine`). This must be restructured into a single bundle object per locale BEFORE `getContent()` or `check-translations.ts` can be written.

```
src/content/
  en/
    site.ts          # exports one bundle: { site, primaryCta, secondaryCta, tertiaryCta, trustLine }
    services.ts      # exports one bundle: { services }
    process.ts       # exports one bundle: { processSteps }
    tech-stack.ts
    example-scenarios.ts
    engagement-models.ts
    faq.ts
    ecosystem.ts
    legal.ts
  sk/
    site.ts          # same shape, Slovak content
    services.ts
    process.ts
    tech-stack.ts
    example-scenarios.ts
    engagement-models.ts
    faq.ts
    ecosystem.ts
    legal.ts
  types.ts           # shared types (Locale updated)
```

Each EN file is restructured to export one bundle object:

```ts
// src/content/en/site.ts
export const siteBundle = {
  site: {/* ... */},
  primaryCta: {/* ... */},
  secondaryCta: {/* ... */},
  tertiaryCta: {/* ... */},
  trustLine: '/* ... */',
};
```

### 1.3 Content resolution

```ts
// src/lib/i18n.ts
import type { Locale } from '../content/types';
import { siteBundle as enSite } from '../content/en/site';
import { siteBundle as skSite } from '../content/sk/site';
// ... etc for each content module

const enBundle = { site: enSite, services: enServices /* ... */ };
const skBundle = { site: skSite, services: skServices /* ... */ };

export function getContent(locale: Locale) {
  return locale === 'sk' ? skBundle : enBundle;
}

export function getAlternatePath(url: URL, targetLocale: Locale): string {
  const path = url.pathname;
  if (targetLocale === 'sk') return '/sk' + path;
  return path.replace(/^\/sk/, '') || '/';
}
```

Components call `getContent(Astro.currentLocale)` — no fallback.

### 1.4 Types update

```ts
// src/content/types.ts
export type Locale = 'en' | 'sk';
export const locales = ['en', 'sk'] as const;
export const defaultLocale = 'en';
```

---

## 2. Page structure

### 2.1 Route map

| Route                | Locale          | Page file                                                      |
| -------------------- | --------------- | -------------------------------------------------------------- |
| `/`                  | EN              | `src/pages/index.astro` (refactored)                           |
| `/sk/`               | SK              | `src/pages/sk/index.astro` (new)                               |
| `/privacy/`          | EN              | `src/pages/privacy/index.astro` (refactored)                   |
| `/sk/privacy/`       | SK              | `src/pages/sk/privacy/index.astro` (new)                       |
| `/cookies/`          | EN              | `src/pages/cookies/index.astro` (refactored)                   |
| `/sk/cookies/`       | SK              | `src/pages/sk/cookies/index.astro` (new)                       |
| `/terms/`            | EN              | `src/pages/terms/index.astro` (refactored)                     |
| `/sk/terms/`         | SK              | `src/pages/sk/terms/index.astro` (new)                         |
| `/404`               | EN              | `src/pages/404.astro` (refactored)                             |
| `/sk/404`            | SK              | `src/pages/sk/404.astro` (new)                                 |
| `/api/audit-request` | locale-agnostic | `src/pages/api/audit-request.ts` (accepts `locale` in payload) |

**Section anchor IDs are locale-invariant:** `#services`, `#pricing`, `#faq`, etc. are not translated. This ensures cross-locale anchor nav works (`/sk/#pricing` → `/#pricing`).

---

## 3. Component refactor

### 3.1 Locale prop pattern

```astro
---
import { getContent } from '../../lib/i18n';
import type { Locale } from '../../content/types';

interface Props {
  locale?: Locale;
}
const { locale = 'en' } = Astro.props;
const { services } = getContent(locale);
---
```

### 3.2 Components to refactor (all 16 + form)

- `BaseLayout.astro` — locale prop, `<html lang>`, hreflang, og:locale, JSON-LD `inLanguage`
- `Header.astro` — nav labels, CTAs, ecosystem links, language switch (mobile: inside menu panel)
- `Footer.astro` — nav, ecosystem, legal links, contact, copyright, language switch
- `Hero.astro` — headline, subheadline, CTAs, trust line, browser mockup labels (aria-hidden, not translated)
- `Problem.astro` — section title, 10 problem strings
- `Services.astro` — section title, 7 service cards
- `Differentiation.astro` — section title, 5 layer descriptions, closing message
- `Process.astro` — section title, 5 steps
- `TechStack.astro` — section title, 5 categories
- `ExampleScenarios.astro` — section title, badge, 3 scenarios
- `EngagementModels.astro` — section title, pricing copy, 3 models
- `SelfReferentialProof.astro` — section title, 4 metrics, footer line
- `Cta.astro` — section title, offer copy, bullet list, form container, privacy notice
- `Ecosystem.astro` — section title, 4 brand cards
- `Faq.astro` — section title, 12 items
- `LegalLayout.astro` — back link
- `404.astro` — heading, description, button labels
- `AuditRequestForm.tsx` — all UI strings, field labels, placeholders, button text, success/error states, privacy notice, Turnstile `language: locale`

---

## 4. Form i18n

### 4.1 Enum refactor (no backwards-compat hedge)

```ts
// lib/validation.ts
export const projectTypes = [
  {
    id: 'audit',
    label: { en: 'Technical Web Audit', sk: 'Technický web audit' },
  },
  { id: 'landing-page', label: { en: 'Landing Page', sk: 'Landing Page' } },
  // ...
] as const;

export const projectTypeIds = projectTypes.map((p) => p.id) as const;

export const auditRequestSchema = z.object({
  projectType: z.enum(projectTypeIds),
  // ...
});
```

### 4.2 Webhook payload (IDs only)

```json
{
  "projectTypeId": "audit",
  "locale": "sk",
  "name": "...",
  "email": "...",
  "message": "..."
}
```

### 4.3 API endpoint i18n

The form sends `locale` in the payload. The endpoint returns localized error messages:

```ts
const messages = {
  en: {
    validation: '...',
    captcha: '...',
    webhook: '...',
    timeout: '...',
    rateLimited: '...',
  },
  sk: {
    validation: '...',
    captcha: '...',
    webhook: '...',
    timeout: '...',
    rateLimited: '...',
  },
};
```

### 4.4 Form UI strings

`src/lib/translations.ts` exports both locales' UI strings. The React island picks `translations[locale]` at runtime.

**Tradeoff (stated explicitly):** both locales' strings ship in the client bundle regardless of which page loaded. At 2 locales this is a few KB — acceptable. Revisit if more locales are added.

### 4.5 Turnstile language

```ts
ts.render(turnstileRef.current, {
  sitekey: turnstileSiteKey,
  callback: (token: string) => setTurnstileToken(token),
  'error-callback': () => setTurnstileToken(''),
  theme: 'light',
  language: locale, // 'en' or 'sk' — explicit, not auto-detect
});
```

---

## 5. SEO

### 5.1 hreflang tags

```html
<link rel="alternate" hreflang="en" href="https://web-dev-studio.com/" />
<link rel="alternate" hreflang="sk" href="https://web-dev-studio.com/sk/" />
<link rel="alternate" hreflang="x-default" href="https://web-dev-studio.com/" />
```

### 5.2 Canonical

Each page's canonical points to itself.

### 5.3 Sitemap

```js
integrations: [
  sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en-GB', sk: 'sk-SK' },
    },
  }),
],
```

### 5.4 JSON-LD

```json
{ "@type": "Organization", "inLanguage": "sk", ... }
```

### 5.5 og:locale

```html
<meta property="og:locale" content="en_GB" />
<!-- EN pages -->
<meta property="og:locale" content="sk_SK" />
<!-- SK pages -->
```

### 5.6 `<html lang>`

```html
<html lang="en">
  <!-- EN pages -->
  <html lang="sk">
    <!-- SK pages -->
  </html>
</html>
```

---

## 6. Auto-redirect (simplified)

An inline script on EN root pages checks browser language and redirects to `/sk/` if Slovak is preferred.

**Guard conditions (all must be true):**

1. Current path does NOT start with `/sk/` (prevent loops)
2. `navigator.languages` includes a Slovak code (`sk`, `sk-SK`)
3. `localStorage.getItem('i18n-choice')` is null (user hasn't explicitly chosen)
4. No `?no-redirect` query param (escape hatch)

```js
(function () {
  try {
    if (location.pathname.startsWith('/sk/')) return;
    if (localStorage.getItem('i18n-choice')) return;
    if (new URLSearchParams(location.search).has('no-redirect')) return;
    var langs = navigator.languages || [navigator.language];
    var isSk = langs.some(function (l) {
      return l.toLowerCase().startsWith('sk');
    });
    if (isSk) {
      localStorage.setItem('i18n-choice', 'sk');
      var skPath = '/sk' + location.pathname + location.search + location.hash;
      location.replace(skPath);
    }
  } catch (e) {
    /* ignore */
  }
})();
```

**SEO note:** search engines don't execute JS redirects. hreflang tags are the primary signal. The JS redirect is a UX enhancement for human visitors.

---

## 7. Language switch

### 7.1 Component

`LanguageSwitch.astro` — renders `EN | SK` with current locale marked:

```html
<nav aria-label="Language">
  <a href="/" aria-current="true">EN</a>
  <span aria-hidden="true">|</span>
  <a href="/sk/">SK</a>
</nav>
```

- Links point to the **same page** in the other locale (via `getAlternatePath`)
- Clicking sets `localStorage('i18n-choice', locale)` to override auto-detection
- **Desktop:** in Header next to ThemeToggle
- **Mobile:** inside the mobile menu panel, not the sticky header row (which has only room for ThemeToggle + hamburger)
- Also in Footer

---

## 8. Analytics

Add `locale` as a property to every Umami event:

```ts
export function track(eventName: string, props?: Record<string, unknown>) {
  const locale = document.documentElement.lang || 'en';
  window.umami?.track(eventName, { ...props, locale });
}
```

Event properties are supported on all Umami Cloud tiers — no dimension upgrade needed.

---

## 9. Legal pages (SK)

### 9.1 Translation + legal review

- AI generates Slovak translations of `privacyPolicy`, `cookiePolicy`, `terms`
- **DoD gate: SK legal pages reviewed by Slovak legal counsel** (R2)
- SK legal pages get their own `lastUpdated` (independent of EN — legal review timing won't match)

### 9.2 SK legal page routes

- `/sk/privacy/`, `/sk/cookies/`, `/sk/terms/`
- `LegalLayout.astro` reused (accepts `LegalContent` prop + `locale`)

---

## 10. CI guard (created from scratch)

### 10.1 Content guard (both locales)

```bash
# Check built HTML for TODO/lorem/placeholder in both EN and SK pages
grep -r -l "TODO\|lorem ipsum\|placeholder" dist/client/ && exit 1 || true
```

### 10.2 Translation completeness (SK files only — via dorny/paths-filter)

**Bug fix (Codex A1):** `glob()` does not exist in GitHub Actions expressions. Use `dorny/paths-filter@v3` instead.

```yaml
- uses: dorny/paths-filter@v3
  id: filter
  with:
    filters: |
      sk: 'src/content/sk/**'

- name: Check translation completeness (SK)
  if: steps.filter.outputs.sk == 'true'
  run: bun run scripts/check-translations.ts
```

`scripts/check-translations.ts` is written AFTER the content restructure (§1.2) lands, against the actual bundle shape.

### 10.3 Playwright smoke (SK)

- Visit `/sk/`, verify `<html lang="sk">`
- Verify form renders in Slovak (field labels, button text)
- Visit `/sk/privacy/`, verify Slovak content

---

## 11. Translation completeness enforcement

**Runs only when `src/content/sk/**` files change.** Urgent EN-only fixes can ship without SK blocker. SK drift is caught when SK files are next edited.

If a SK key is missing, the check fails with:

```
[i18n] Missing SK translation for: services[2].includes[1]
```

---

## 12. Implementation phases

### Phase i18n-1 — Infrastructure + content restructure

- Update `astro.config.mjs` with i18n config + sitemap i18n (`en-GB`, `sk-SK`)
- Update `types.ts` (`Locale = 'en' | 'sk'`)
- **Restructure content files into per-locale bundle objects:**
  - Move `src/content/*.ts` → `src/content/en/*.ts`
  - Restructure each file's exports into a single bundle object
  - Update every consuming component's imports
- Create `lib/i18n.ts` (`getContent`, `getAlternatePath`)
- Create `lib/translations.ts` (form UI strings, both locales)
- Refactor `validation.ts` enum values to stable IDs + localized labels
- Create `src/content/sk/` directory (files start as structural copies of EN)

### Phase i18n-2 — Component refactor

- Add `locale` prop to BaseLayout, Header, Footer, all 13 sections, LegalLayout, 404
- Replace direct content imports with `getContent(Astro.currentLocale)` calls
- Refactor AuditRequestForm.tsx (`locale` prop, localized strings, Turnstile `language: locale`)
- Refactor API endpoint (accept `locale`, return localized errors, send IDs only)

### Phase i18n-3 — SK page routes

- Create `src/pages/sk/index.astro`, `src/pages/sk/privacy/index.astro`, etc.
- Create `src/pages/sk/404.astro`

### Phase i18n-4 — Slovak translation

- AI-generate Slovak translations for all content files
- AI-generate Slovak form UI strings
- AI-generate Slovak legal content (own `lastUpdated`)
- Run translation completeness check (must pass)

### Phase i18n-5 — Language switch + auto-redirect

- Create `LanguageSwitch.astro` (desktop: header; mobile: inside menu panel)
- Wire into Header + Footer
- Add simplified auto-redirect inline script to EN pages
- `localStorage('i18n-choice')` persistence on explicit switch

### Phase i18n-6 — SEO

- Fix `en_EU` → `en_GB` in BaseLayout
- hreflang alternate links in BaseLayout
- Sitemap i18n config (`en-GB`, `sk-SK`)
- JSON-LD `inLanguage` per locale
- `og:locale` per page (`en_GB` / `sk_SK`)
- `<html lang>` per locale
- **Spelling skim (Codex C-3):** check EN copy for British vs American spelling consistency with `en_GB` locale (look for: -ize/-ise, color/colour, -or/-our endings). If American spelling found: either fix to British or switch locale to `en` (no region).

### Phase i18n-7 — Analytics + CI

- Add `locale` property to Umami events
- Create CI content guard for both locales (grep TODO/lorem/placeholder)
- Create translation completeness check via `dorny/paths-filter@v3` (Codex A1 fix)
- Playwright smoke test: `/sk/` renders in Slovak
- Ship EN-only grep guard now (overdue from plan v3 Phase 9)

### Phase i18n-8 — Review gates (DoD, enforced by CODEOWNERS)

**CODEOWNERS (Codex C-1 — merge-blocking, not just a checklist):**

```
# .github/CODEOWNERS
src/content/sk/**      @slovak-speaker-handle
**/legal.ts            @legal-reviewer-handle
```

Branch protection: require review from these owners for matching paths. R1/R2 DoD gates are now enforced by GitHub, not just a template.

**PR template checklist** (`.github/pull_request_template.md`):

- [ ] If SK content changed: Slovak speaker reviewed copy (name: ______)
- [ ] If SK legal changed: Slovak legal counsel reviewed (issue: #____)
- [ ] If webhook payload changed: no consumer to coordinate with

**GitHub issue template** (`.github/ISSUE_TEMPLATE/legal-review.md`) — **must include YAML front matter** (Codex C-2):

```yaml
---
name: Legal content review
about: Request legal counsel review of privacy/cookies/terms content
labels: ['legal-review', 'blocked']
---
```

DoD checklist:

- [ ] Slovak speaker reviews all SK copy (tone, grammar, vykanie) — enforced by CODEOWNERS
- [ ] Slovak legal counsel reviews SK legal pages — enforced by CODEOWNERS + issue template
- [ ] Auto-redirect tested: direct nav, empty referrer, Slovak browser → `/sk/`
- [ ] Auto-redirect tested: English browser → `/`
- [ ] Auto-redirect tested: prior `i18n-choice` respected (no redirect)
- [ ] hreflang validated (Google Search Console) — will pass with `en_GB` + `sk_SK`
- [ ] Sitemap includes both locales with alternates
- [ ] Lighthouse 95+ on `/sk/` (mobile + desktop)
- [ ] No untranslated EN strings on SK pages
- [ ] SK OG image exists (`/sk/og.png`) — required before launch
- [ ] Section anchor IDs are locale-invariant
- [ ] EN copy skimmed for British vs American spelling consistency with `en_GB`

---

## 13. Files created/modified

### New files

```
src/content/sk/site.ts
src/content/sk/services.ts
src/content/sk/process.ts
src/content/sk/tech-stack.ts
src/content/sk/example-scenarios.ts
src/content/sk/engagement-models.ts
src/content/sk/faq.ts
src/content/sk/ecosystem.ts
src/content/sk/legal.ts
src/lib/i18n.ts
src/lib/translations.ts
src/components/ui/LanguageSwitch.astro
src/pages/sk/index.astro
src/pages/sk/privacy/index.astro
src/pages/sk/cookies/index.astro
src/pages/sk/terms/index.astro
src/pages/sk/404.astro
scripts/check-translations.ts
.github/CODEOWNERS
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/legal-review.md   (with YAML front matter)
public/sk/og.png
```

### Modified files

```
astro.config.mjs              # i18n config + sitemap i18n (en-GB, sk-SK)
src/content/types.ts          # Locale type
src/content/*.ts → en/*.ts    # moved + restructured into bundle objects
src/lib/validation.ts         # enum IDs + localized labels
src/lib/analytics.ts          # locale property
src/layouts/BaseLayout.astro  # locale prop, hreflang, html lang, og:locale (en_GB), JSON-LD
src/layouts/LegalLayout.astro # locale prop, back link
src/components/layout/Header.astro    # locale prop, language switch (mobile: menu panel)
src/components/layout/Footer.astro    # locale prop, language switch
src/components/sections/*.astro       # locale prop (all 13)
src/components/forms/AuditRequestForm.tsx  # locale prop, localized strings, Turnstile language
src/pages/index.astro        # pass locale="en"
src/pages/privacy/index.astro # pass locale="en"
src/pages/cookies/index.astro # pass locale="en"
src/pages/terms/index.astro   # pass locale="en"
src/pages/404.astro           # pass locale="en"
src/pages/api/audit-request.ts # localized errors, IDs only
.github/workflows/ci.yml      # dorny/paths-filter + content guard + SK smoke test
```

---

## 14. What this plan does NOT do

- Does not add a third locale (structure supports it)
- Does not add locale-specific content (SK-specific case studies or pricing)
- Does not add a locale subdomain
- Does not add server-side Accept-Language detection (static-first)
- Does not translate the browser mockup visual labels (decorative, `aria-hidden`)
- Does not change CSP, security headers, or Cloudflare config
- Does not add MDX or a CMS
- Does not add backwards-compat for webhook enum values (no consumer exists)

---

## 15. Open items before SK launch

**Required:**

- Slovak speaker to review AI-generated copy (R1) — enforced by CODEOWNERS
- Slovak legal counsel to review SK legal pages (R2) — enforced by CODEOWNERS + issue template
- SK OG image (`/sk/og.png`)
- Confirm `@slovak-speaker-handle` and `@legal-reviewer-handle` GitHub usernames for CODEOWNERS

**Nice to have:**

- SK-specific favicon (if branding differs)
- Google Search Console property for `/sk/` subpath
- SK backlinks / ecosystem referrals to `/sk/`

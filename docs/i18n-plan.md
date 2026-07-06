# i18n Plan — Slovak (SK) Language Support

Source: plan v3 build, post-dark-mode commit
Target: add Slovak as the second locale, starting the multi-language system
Reviewers: Codex + Claude Fable 5 (this plan will be grilled before implementation)

## Resolved decisions

| Fork               | Choice                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| URL structure      | `/sk/` prefix for SK, EN stays at root (`prefixDefaultLocale: false`)   |
| Translation source | AI-generated Slovak, no human review (user choice — risk flagged below) |
| Auto-redirect      | Client-side script auto-redirects Slovak browsers to `/sk/`             |
| Form enum values   | Stable IDs + translated display labels; webhook receives IDs            |
| SK scope           | Full SK: homepage, 404, privacy, cookies, terms                         |

## Risk register (must be addressed before launch)

| #   | Risk                                                                                     | Severity     | Mitigation                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | AI Slovak copy may be grammatically incorrect, wrong register (vykanie), or off-tone     | **High**     | DoD gate: SK copy reviewed by a Slovak speaker before `/sk/` goes live. AI draft is a starting point, not a finish line.                              |
| R2  | AI-translated legal pages (privacy/cookies/terms) are a legal liability under Slovak law | **Critical** | DoD gate: SK legal pages reviewed by Slovak legal counsel. Launch blocked until sign-off. EN legal pages already require this; SK is no different.    |
| R3  | Client-side auto-redirect can cause loops, break deep links, or confuse search engines   | Medium       | Strict guard conditions (see §6). `hreflang` + canonical tags are the primary SEO signal; JS redirect is a UX enhancement for human visitors.         |
| R4  | Form enum refactor (strings → IDs) breaks the webhook contract                           | Medium       | Webhook recipient notified before deploy. Payload includes both `projectTypeId` and `projectTypeLabel` (EN) for backwards compatibility.              |
| R5  | Partial translations create "SEO litter" (Fable B5)                                      | Medium       | SK routes are only added when 100% of in-scope content is translated. No fallback to EN on missing strings — if a string is missing, the build fails. |

---

## 1. Architecture

### 1.1 Astro i18n config

```js
// astro.config.mjs addition
i18n: {
  locales: ['en', 'sk'],
  defaultLocale: 'en',
  routing: {
    prefixDefaultLocale: false,  // EN at root, SK at /sk/
    redirectToDefaultLocale: false,
  },
},
```

`Astro.currentLocale` is available on all pages (including prerendered). It returns `'en'` for root paths and `'sk'` for `/sk/*`.

### 1.2 Content structure

**Per-locale files** — clearest for translators and type safety:

```
src/content/
  en/
    site.ts
    services.ts
    process.ts
    tech-stack.ts
    example-scenarios.ts
    engagement-models.ts
    faq.ts
    ecosystem.ts
    legal.ts
  sk/
    site.ts
    services.ts
    process.ts
    tech-stack.ts
    example-scenarios.ts
    engagement-models.ts
    faq.ts
    ecosystem.ts
    legal.ts
  types.ts          # shared types (unchanged, Locale updated)
```

Each locale file exports the same shape as the current files. The existing `src/content/*.ts` files move to `src/content/en/`.

### 1.3 Content resolution

A `lib/i18n.ts` module provides a typed resolver:

```ts
import type { Locale } from '../content/types';
import * as en from '../content/en/site';
import * as sk from '../content/sk/site';
// ... etc for each content module

export function getContent(locale: Locale) {
  switch (locale) {
    case 'sk':
      return skBundle;
    default:
      return enBundle;
  }
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/');
  if (segments[1] === 'sk') return 'sk';
  return 'en';
}
```

Components call `getContent(Astro.currentLocale ?? getLocaleFromUrl(Astro.url))` in their frontmatter. This is a minimal refactor — each component changes one import line.

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

| Route                | Locale          | Page file                                                                   |
| -------------------- | --------------- | --------------------------------------------------------------------------- |
| `/`                  | EN              | `src/pages/index.astro` (existing, refactored)                              |
| `/sk/`               | SK              | `src/pages/sk/index.astro` (new)                                            |
| `/privacy/`          | EN              | `src/pages/privacy/index.astro` (existing)                                  |
| `/sk/privacy/`       | SK              | `src/pages/sk/privacy/index.astro` (new)                                    |
| `/cookies/`          | EN              | `src/pages/cookies/index.astro` (existing)                                  |
| `/sk/cookies/`       | SK              | `src/pages/sk/cookies/index.astro` (new)                                    |
| `/terms/`            | EN              | `src/pages/terms/index.astro` (existing)                                    |
| `/sk/terms/`         | SK              | `src/pages/sk/terms/index.astro` (new)                                      |
| `/404`               | EN              | `src/pages/404.astro` (existing)                                            |
| `/sk/404`            | SK              | `src/pages/sk/404.astro` (new)                                              |
| `/api/audit-request` | locale-agnostic | `src/pages/api/audit-request.ts` (refactored to accept `locale` in payload) |

### 2.2 Page pattern

Each SK page mirrors its EN counterpart but passes `locale="sk"` to the layout and components:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
// ... section imports
import { getContent } from '../../lib/i18n';

const locale = 'sk';
const content = getContent(locale);
const title = content.site.seo.title;
const description = content.site.seo.description;
---

<BaseLayout title={title} description={description} path="/sk/" locale={locale}>
  <Header locale={locale} />
  <main id="main">
    <Hero locale={locale} />
    <!-- ... -->
  </main>
  <Footer locale={locale} />
</BaseLayout>
```

**Alternative considered:** a single `[locale]/index.astro` dynamic route. Rejected because:

- `prefixDefaultLocale: false` means EN is at root, not `/en/` — a dynamic route can't cleanly handle this asymmetry
- Static file-per-locale is more explicit and easier to audit
- Legal pages have different structures per locale (SK legal review may require different content, not just translation)

---

## 3. Component refactor

### 3.1 Locale prop pattern

Every component that renders content accepts a `locale` prop and resolves content internally:

```astro
---
// Before:
import { services } from '../../content/services';

// After:
import { getContent } from '../../lib/i18n';
import type { Locale } from '../../content/types';

interface Props {
  locale?: Locale;
}
const { locale = 'en' } = Astro.props;
const { services } = getContent(locale);
---
```

### 3.2 Components to refactor (11)

- `Header.astro` — nav labels, CTA labels, ecosystem links, language switch
- `Footer.astro` — nav, ecosystem, legal links, contact, copyright
- `Hero.astro` — headline, subheadline, CTAs, trust line, browser mockup labels
- `Problem.astro` — section title, 10 problem strings
- `Services.astro` — section title, 7 service cards (title, summary, includes)
- `Differentiation.astro` — section title, 5 layer descriptions, closing message
- `Process.astro` — section title, 5 steps (title, summary, deliverables)
- `TechStack.astro` — section title, 5 categories (title, items)
- `ExampleScenarios.astro` — section title, badge, 3 scenarios (sector, problem, solution, result)
- `EngagementModels.astro` — section title, pricing copy, 3 models
- `SelfReferentialProof.astro` — section title, 4 metrics, footer line
- `Cta.astro` — section title, offer copy, bullet list, form container, privacy notice
- `Ecosystem.astro` — section title, 4 brand cards
- `Faq.astro` — section title, 12 items
- `AuditRequestForm.tsx` — all UI strings, field labels, placeholders, button text, success/error states, privacy notice
- `LegalLayout.astro` — back link
- `404.astro` — heading, description, button labels

### 3.3 BaseLayout refactor

Add `locale` prop:

- `<html lang={locale}>` (currently hardcoded `en`)
- `<meta property="og:locale" content={locale === 'sk' ? 'sk_SK' : 'en_EU'}>`
- Canonical URL reflects the locale path
- hreflang alternate links (see §5)
- JSON-LD `inLanguage` field

---

## 4. Form i18n

### 4.1 Enum refactor (breaking change — coordinate with webhook recipient)

**Current:** enum values are English strings (`"Technical Web Audit"`)
**After:** enum values are stable IDs (`"audit"`), display labels are localized

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
  // ... validates against projectTypeIds (stable IDs)
  projectType: z.enum(projectTypeIds),
  // ...
});
```

The React form receives `locale` prop and renders localized labels from the enum definitions.

### 4.2 Webhook payload

```json
{
  "projectTypeId": "audit",
  "projectTypeLabel": "Technical Web Audit",
  "locale": "sk"
  // ... other fields
}
```

Both `projectTypeId` (stable) and `projectTypeLabel` (EN, for backwards compat) are sent. The webhook recipient can migrate to IDs at their pace.

### 4.3 API endpoint i18n

The form sends `locale` in the payload. The endpoint uses it to select error message language:

```ts
const messages = {
  en: {
    validation: 'Please check the form fields and try again.',
    captcha: 'Verification failed. Please try again.',
    webhook: 'Something went wrong on our end. Please try again or email us.',
    timeout: 'The request timed out. Please try again or email us directly.',
    rateLimited: 'Too many requests. Please try again later.',
  },
  sk: {
    validation: 'Skontrolujte polia formulára a skúste to znova.',
    captcha: 'Overenie zlyhalo. Skúste to znova.',
    webhook: 'Niečo sa pokazilo. Skúste to znova alebo nám napíšte email.',
    timeout: 'Požiadavka vypršala. Skúste to znova alebo nám napíšte email.',
    rateLimited: 'Príliš veľa požiadaviek. Skúste to neskôr.',
  },
};
```

### 4.4 Form UI strings

The React island receives a `translations` prop (all UI strings) from the Astro page, OR resolves them from a `translations.ts` file based on the `locale` prop. I recommend the latter (one source of truth):

```
src/lib/translations.ts
  export const formTranslations = {
    en: { nameLabel: 'Name', emailLabel: 'Work email', ... },
    sk: { nameLabel: 'Meno', emailLabel: 'Pracovný email', ... },
  };
```

---

## 5. SEO

### 5.1 hreflang tags

Every page declares alternate links to both locales:

```html
<link rel="alternate" hreflang="en" href="https://web-dev-studio.com/" />
<link rel="alternate" hreflang="sk" href="https://web-dev-studio.com/sk/" />
<link rel="alternate" hreflang="x-default" href="https://web-dev-studio.com/" />
```

Legal pages declare their specific alternates:

```html
<!-- on /privacy/ -->
<link
  rel="alternate"
  hreflang="en"
  href="https://web-dev-studio.com/privacy/"
/>
<link
  rel="alternate"
  hreflang="sk"
  href="https://web-dev-studio.com/sk/privacy/"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://web-dev-studio.com/privacy/"
/>
```

### 5.2 Canonical

Each page's canonical points to itself (not to the other locale):

- `/` → `canonical: https://web-dev-studio.com/`
- `/sk/` → `canonical: https://web-dev-studio.com/sk/`

### 5.3 Sitemap

`@astrojs/sitemap` i18n config:

```js
// astro.config.mjs
integrations: [
  sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en-EU', sk: 'sk-SK' },
    },
  }),
],
```

This generates `<xhtml:link rel="alternate" hreflang="..." />` entries in the sitemap.

### 5.4 JSON-LD

Add `inLanguage` to the Organization/ProfessionalService schema on each page:

```json
{ "@type": "Organization", "inLanguage": "sk", ... }
```

### 5.5 og:locale

```html
<meta property="og:locale" content="sk_SK" />
<!-- on SK pages -->
<meta property="og:locale" content="en_EU" />
<!-- on EN pages -->
```

### 5.6 `<html lang>`

```html
<html lang="sk">
  <!-- SK pages -->
  <html lang="en">
    <!-- EN pages -->
  </html>
</html>
```

---

## 6. Auto-redirect (client-side)

An inline script on the EN root pages (`/`, `/privacy/`, `/cookies/`, `/terms/`, `/404`) checks browser language and redirects to `/sk/` if Slovak is preferred.

**Strict guard conditions (all must be true):**

1. Current path does NOT already start with `/sk/` (prevent loops)
2. `navigator.language` or `navigator.languages` includes a Slovak code (`sk`, `sk-SK`)
3. `localStorage.getItem('i18n-choice')` is null (user hasn't explicitly chosen EN)
4. No `?no-redirect` query param (escape hatch for testing)
5. Document referrer does not start with the same origin (don't redirect if the user navigated from within the site — e.g., clicked an EN link)

**On redirect:** set `localStorage.setItem('i18n-choice', 'sk')` so the user isn't redirected again if they switch back to EN.

**On explicit language switch:** set `localStorage.setItem('i18n-choice', selectedLocale)` — this overrides auto-detection permanently.

**SEO note:** search engines generally don't execute JS redirects. `hreflang` tags are the primary signal for crawlers. The JS redirect is a UX enhancement for human visitors with Slovak browsers, not an SEO mechanism.

```js
// inline script (on EN pages only)
(function () {
  try {
    if (location.pathname.startsWith('/sk/')) return;
    if (localStorage.getItem('i18n-choice')) return;
    if (new URLSearchParams(location.search).has('no-redirect')) return;
    if (
      document.referrer &&
      new URL(document.referrer).origin === location.origin
    )
      return;
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

---

## 7. Language switch

Replaces the dropped "Coming soon" placeholder (Fable B5). Now legitimate since SK exists.

### 7.1 Component

`LanguageSwitch.astro` — renders `EN | SK` with the current locale marked:

```html
<nav aria-label="Language">
  <a href="/" aria-current="true">EN</a>
  <span aria-hidden="true">|</span>
  <a href="/sk/">SK</a>
</nav>
```

- `aria-current="true"` on the active locale
- Links point to the **same page** in the other locale (not just homepage):
  - On `/privacy/` → EN link to `/privacy/`, SK link to `/sk/privacy/`
  - On `/sk/` → EN link to `/`, SK link to `/sk/`
- Clicking sets `localStorage('i18n-choice', locale)` to override auto-detection
- Placed in Header next to ThemeToggle, and in Footer

### 7.2 Cross-locale path mapping

```ts
// lib/i18n.ts
export function getAlternatePath(url: URL, targetLocale: Locale): string {
  const path = url.pathname;
  if (targetLocale === 'sk') {
    // EN → SK: prepend /sk
    return '/sk' + path;
  } else {
    // SK → EN: strip /sk prefix
    return path.replace(/^\/sk/, '') || '/';
  }
}
```

---

## 8. Analytics

Add `locale` as a dimension to Umami events:

```ts
// lib/analytics.ts
export function track(eventName: string, props?: Record<string, unknown>) {
  const locale = document.documentElement.lang || 'en';
  window.umami?.track(eventName, { ...props, locale });
}
```

All existing events (`cta_primary_click`, `audit_form_submit_success`, etc.) now include `locale: 'en' | 'sk'` so conversion rates can be compared per language.

---

## 9. Legal pages (SK)

### 9.1 Translation + legal review

- AI generates Slovak translations of `privacyPolicy`, `cookiePolicy`, `terms`
- **DoD gate: SK legal pages reviewed by Slovak legal counsel before launch**
- Slovak law may require specific legal content for SK-facing business (e.g., specific wording for GDPR notices, consumer protection terms)
- The `lastUpdated` date should be the same as EN (or updated when SK legal review changes the content)

### 9.2 Legal content structure

The `content/sk/legal.ts` file mirrors `content/en/legal.ts` with Slovak text. The `LegalLayout.astro` is reused — it already accepts a `LegalContent` prop.

### 9.3 SK legal page routes

- `/sk/privacy/` → `src/pages/sk/privacy/index.astro`
- `/sk/cookies/` → `src/pages/sk/cookies/index.astro`
- `/sk/terms/` → `src/pages/sk/terms/index.astro`

---

## 10. CI guard

Extend the existing CI grep guard (from plan v3 Phase 9) to check both locales:

- `dist/` HTML for SK pages must not contain `TODO`, `lorem`, `placeholder`
- SK pages must not contain untranslated EN strings (check for a sentinel — see §11)
- Both `/sitemap-index.xml` and `/sk/sitemap-index.xml` (or combined sitemap with alternates) must exist

---

## 11. Translation completeness enforcement

**No partial translations ship.** A build-time check ensures every SK string is present and non-empty:

```ts
// scripts/check-translations.ts (or a Vite plugin)
import { en } from './src/content/en/site';
import { sk } from './src/content/sk/site';
// recursively compare keys; fail if any SK key is missing or empty
```

If a string is missing, the build fails with a clear message:

```
[i18n] Missing SK translation for: services[2].includes[1]
```

This prevents the "half-empty translated pages are SEO litter" problem (Fable B5).

---

## 12. Implementation phases

### Phase i18n-1 — Infrastructure

- Update `astro.config.mjs` with i18n config
- Update `types.ts` (`Locale = 'en' | 'sk'`)
- Create `lib/i18n.ts` (getContent, getLocaleFromUrl, getAlternatePath)
- Create `lib/translations.ts` (form UI strings)
- Refactor `validation.ts` enum values to stable IDs + localized labels
- Move `src/content/*.ts` → `src/content/en/*.ts`
- Create `src/content/sk/` directory (files start as copies of EN for structure)

### Phase i18n-2 — Component refactor

- Add `locale` prop to BaseLayout, Header, Footer, all 13 sections, LegalLayout, 404
- Replace direct content imports with `getContent(locale)` calls
- Refactor AuditRequestForm.tsx to accept `locale` prop and use localized strings
- Refactor API endpoint to accept `locale` in payload and return localized errors

### Phase i18n-3 — SK page routes

- Create `src/pages/sk/index.astro`, `src/pages/sk/privacy/index.astro`, etc.
- Create `src/pages/sk/404.astro`
- Each SK page passes `locale="sk"` to layout and components

### Phase i18n-4 — Slovak translation

- AI-generate Slovak translations for all content files
- AI-generate Slovak form UI strings
- AI-generate Slovak legal content
- Run translation completeness check (build must pass)

### Phase i18n-5 — Language switch + auto-redirect

- Create `LanguageSwitch.astro`
- Wire into Header (next to ThemeToggle) and Footer
- Add auto-redirect inline script to EN pages
- Add `localStorage('i18n-choice')` persistence on explicit switch

### Phase i18n-6 — SEO

- hreflang alternate links in BaseLayout
- Sitemap i18n config
- JSON-LD `inLanguage` per locale
- og:locale per page
- `<html lang>` per locale

### Phase i18n-7 — Analytics + CI

- Add `locale` dimension to Umami events
- Translation completeness build check
- CI guard for SK pages (no TODO/lorem/placeholder)
- Playwright smoke test: visit `/sk/`, verify `<html lang="sk">`, verify form renders in Slovak

### Phase i18n-8 — Review gates (DoD)

- [ ] Slovak speaker reviews all SK copy (tone, grammar, vykanie)
- [ ] Slovak legal counsel reviews SK legal pages
- [ ] Webhook recipient confirms enum ID migration
- [ ] Auto-redirect tested: Slovak browser → `/sk/`, English browser → `/`, prior choice respected
- [ ] hreflang validated (Google Search Console)
- [ ] Sitemap includes both locales with alternates
- [ ] Lighthouse 95+ on `/sk/` (mobile + desktop)
- [ ] No untranslated EN strings on SK pages

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
```

### Modified files

```
astro.config.mjs              # i18n config + sitemap i18n
src/content/types.ts          # Locale type
src/content/*.ts → en/*.ts    # moved
src/lib/validation.ts         # enum IDs + localized labels
src/lib/analytics.ts          # locale dimension
src/layouts/BaseLayout.astro  # locale prop, hreflang, html lang, og:locale, JSON-LD
src/layouts/LegalLayout.astro # locale prop, back link
src/components/layout/Header.astro    # locale prop, language switch
src/components/layout/Footer.astro    # locale prop, language switch
src/components/sections/*.astro       # locale prop (all 13)
src/components/forms/AuditRequestForm.tsx  # locale prop, localized strings
src/pages/index.astro        # pass locale="en"
src/pages/privacy/index.astro # pass locale="en"
src/pages/cookies/index.astro # pass locale="en"
src/pages/terms/index.astro   # pass locale="en"
src/pages/404.astro           # pass locale="en"
src/pages/api/audit-request.ts # localized error messages
src/styles/global.css         # no change (dark mode already token-based)
public/_headers               # no change (same origin)
```

---

## 14. What this plan does NOT do

- Does not add a third locale (structure supports it, but only EN + SK are built)
- Does not add locale-specific content (e.g., SK-specific case studies, SK-specific pricing) — SK is a translation of the same offer
- Does not add a locale subdomain (e.g., `sk.web-dev-studio.com`) — we use path prefix
- Does not add server-side Accept-Language detection (static-first; client-side only)
- Does not translate the browser mockup visual labels in the Hero (they're decorative; `aria-hidden="true"`)
- Does not change the CSP, security headers, or Cloudflare config (same origin, same policies)
- Does not add MDX or a CMS — translations are typed TS files, same as EN

---

## 15. Open items before SK launch

**Required:**

- Slovak speaker to review AI-generated copy (R1)
- Slovak legal counsel to review SK legal pages (R2)
- Webhook recipient to confirm enum ID migration (R4)
- Umami Cloud: confirm `locale` dimension doesn't require a plan upgrade

**Nice to have:**

- SK-specific OG image (`/sk/og.png` with Slovak text)
- SK-specific favicon (if branding differs)
- Google Search Console property for `/sk/` subpath
- SK backlinks / ecosystem referrals to `/sk/`

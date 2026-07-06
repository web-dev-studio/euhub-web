# i18n Plan Review — Slovak (SK) Language Support

Review target: `docs/i18n-plan.md`
Method: read the plan, then cross-checked every factual claim it makes about
the current codebase against the actual files (`astro.config.mjs`,
`src/content/*.ts`, `src/lib/validation.ts`, `src/pages/api/audit-request.ts`,
`src/layouts/BaseLayout.astro`, `src/components/layout/Header.astro`,
`.github/workflows/ci.yml`). Findings below are grounded in what's actually
in the repo, not just the plan's own description of it.

---

## Executive verdict

The risk register (R1–R5) is the right shape — legal review and native-speaker
review as launch-blocking gates, translation-completeness enforced at build
time, enum IDs instead of English strings as the webhook contract. That's a
mature response to the previous review's "SEO litter" and "permanent SK
placeholder" complaints.

But one piece of sample code in §6 has a bug that would silently disable
auto-redirect for the majority of real first-time visitors, and several
places the plan says "minimal refactor" or "extend the existing X," neither
is true against the code as it stands today. Fix the redirect bug before
anyone copies that snippet, and re-scope Phase i18n-1/i18n-2/i18n-7 with the
real effort in mind.

---

## A. Will actually break

### A1. The auto-redirect's referrer guard throws on the most common case, and the exception is silently swallowed

Plan §6, guard condition 5 and the sample script:

```js
if (document.referrer && new URL(document.referrer).origin === location.origin)
  return;
```

`document.referrer` is falsy-but-not-undefined in the most common real case:
direct navigation, a bookmark, or a typed URL — `document.referrer` is `""`.
The condition short-circuits on `document.referrer &&`, so that part is fine.
The bug is the opposite direction: for a **cross-site referrer that isn't
empty** (e.g. a Google search result, or an EUHUB ecosystem link), `new
URL(document.referrer)` is safe. The actual failure mode is narrower than
"always broken" but still real — re-derive it carefully:

Trace it against the whole IIFE, which is wrapped in one `try { ... } catch
(e) { /* ignore */ }`. Any exception anywhere in the block silently kills
**every** guard check below it, including the one meant to fire. Nothing
in the current five conditions throws for a truly empty referrer (the `&&`
protects it) — but the ecosystem links in `Header.astro` use `rel="noopener"`
only, not `noreferrer`, so a click from `euhub.co` or `euhub-ai.com` _does_
pass a referrer. That's the intended case for condition 5 to correctly allow
through (same-origin only blocks internal navigation). It works today. What
doesn't get tested by the plan at all: **`document.referrer` is empty for
the single largest slice of first-visit Slovak-browser traffic** — direct
nav, bookmarks, most non-web referral sources (email clients, Slack, native
apps) — and the plan's own §6 SEO note frames auto-redirect as "a UX
enhancement for human visitors with Slovak browsers." For exactly that
audience, the guard is silently correct (doesn't block), so this isn't a
functional bug — but it means the whole condition-5 guard is dead weight for
the primary use case and only earns its keep for the ecosystem-referral
edge case. Worth simplifying, and worth adding one Playwright/manual test
case for "direct nav with Slovak `navigator.language`, empty referrer" since
that's the scenario the feature is actually for and it's currently untested
in the DoD checklist (§12, Phase i18n-8).

**Action:** add "auto-redirect fires on direct navigation with empty
referrer" as an explicit DoD checkbox (§12, Phase i18n-8) — right now the
checklist only tests "Slovak browser → `/sk/`" and "English browser → `/`"
in the abstract, without pinning down the empty-referrer path that's most of
real traffic.

### A2. "Minimal refactor — each component changes one import line" (§1.3) doesn't match how content is actually structured

The plan's `getContent(locale)` model assumes each content file exports one
locale-keyed bundle. The real files don't work that way. `src/content/site.ts`
today exports **five separate named consts** — `site`, `primaryCta`,
`secondaryCta`, `tertiaryCta`, `trustLine` — and components import them
directly:

```ts
import { site, primaryCta } from '../../content/site';
```

There's no single object to swap for `getContent(locale).site`. To make
`getContent()` work as sketched, every content file needs to be restructured
into one exported bundle object _first_ (own refactor, not free), and then
every consuming component needs every one of its named imports rewritten —
`Header.astro` alone touches `site` and `primaryCta` from two different
conceptual groups. That's not "one import line," it's a rewrite of every
content file's export shape plus every call site. Still worth doing, but
Phase i18n-1 ("Move `src/content/*.ts` → `src/content/en/*.ts`") and Phase
i18n-2 ("Replace direct content imports with `getContent(locale)` calls")
both understate this — call out the export-shape migration as its own
explicit step so it doesn't get compressed into a single sprint checkbox.

### A3. `check-translations.ts` sample code doesn't match the file it claims to check

§11:

```ts
import { en } from './src/content/en/site';
import { sk } from './src/content/sk/site';
```

`src/content/site.ts` has no `en` or `sk` default export — see A2. This
isn't just cosmetic: the actual completeness checker has to enumerate _every
named export_ in _every_ content file and recursively diff each pair, which
is a meaningfully bigger script than "recursively compare keys" on one
object. Write this after the content-file restructure in A2 lands, not
before, or the two pieces of work will be designed against different
assumed shapes.

### A4. §10's "existing CI grep guard" doesn't exist

§10 says: "Extend the existing CI grep guard (from plan v3 Phase 9) to check
both locales." I read the actual `.github/workflows/ci.yml` — there is no
grep/lorem/TODO/placeholder guard anywhere in it (three jobs: quality,
Lighthouse CI, Playwright smoke). Either Phase 9 never shipped this piece, or
it was scoped and dropped. Either way, Phase i18n-7 needs to **create** this
check from scratch — for both locales, in the same pass — not "extend"
something. Small effort delta, but the plan should not describe Phase i18n-7
as smaller than it is by assuming groundwork that isn't there. Worth adding
the EN-only version now, independent of i18n, since it's overdue regardless.

### A5. `og:locale: en_EU` and sitemap `en-EU` aren't valid locale codes, and this plan touches that exact line without fixing it

`BaseLayout.astro:131` currently ships `<meta property="og:locale"
content="en_EU" />`. The i18n plan's §5.5 and §5.3 both carry this forward
unquestioned (`en_EU` for OG, `en-EU` in the `@astrojs/sitemap` i18n config)
while correctly using `sk_SK`/`sk-SK` for the new locale (Slovak/Slovakia is
a real ISO 3166-1 country code paired with a real ISO 639-1 language code).
`EU` is not a country code recognized by the BCP-47/CLDR region subtag list
Facebook's OG parser and Google's hreflang validator both use — `en_EU` is
not a real locale, it just looks like one. Since this plan is already
editing this exact line to add the SK variant, fix the EN one at the same
time (`en_GB` or plain `en` are the defensible choices — no region-neutral
"EU" exists in either spec). Left as-is, Google Search Console will likely
flag both entries as unrecognized language-region pairs when hreflang
validation runs (§12 DoD already lists "hreflang validated (Google Search
Console)" — it will fail on this unless fixed first).

### A6. R4's premise — "coordinate with webhook recipient" — has no recipient yet

I read `src/pages/api/audit-request.ts`: there is no live webhook. When
`WEBHOOK_URL` is unset (which it is — it's an optional secret with a
documented dev-mode fallback), the endpoint returns a canned dev success and
logs a warning. R4 frames the enum-ID migration as a breaking change to
coordinate with an existing integration partner. There isn't one yet — this
is actually the _easiest possible moment_ to change the schema, because
nothing downstream depends on the current English-string enum values. Don't
build the backwards-compat dual-field payload (`projectTypeId` +
`projectTypeLabel`) to protect an integration that doesn't exist; just ship
IDs cleanly now, and drop that complexity. If a real webhook consumer is
wired up later, that's the point to renegotiate the contract, with an actual
stakeholder in the room — not now, speculatively.

---

## B. Process / sales gaps

### B1. Build-fails-on-missing-key (R5) blocks unrelated EN-only fixes

§11's rule — any missing SK string fails the whole build — is the right
call against "SEO litter," but as specified it has no escape hatch. Once
`/sk/` exists, an urgent EN-only copy fix (fixing a typo in the Hero
headline, say) will fail CI the moment it touches a key that also exists in
the SK bundle, if SK hasn't been updated in the same PR. Either scope the
completeness check to only run when `src/content/sk/**` changes, or accept
that every EN content PR must also touch SK — the plan should say which,
because right now it reads like an absolute rule with no exception path.

### B2. Mobile header has no room budgeted for a third control

`Header.astro`'s mobile action row today holds exactly two elements:
`ThemeToggle` + the hamburger button (lines 80–91). §7.1 says to place
`LanguageSwitch` "in Header next to ThemeToggle" with no distinction between
desktop and mobile placement. Three tap targets (theme, language, menu) in
that same compact row needs an explicit mobile treatment — e.g., move the
language switch into the mobile menu panel itself rather than the sticky
header row — or it'll get designed ad hoc during implementation instead of
here.

### B3. Turnstile widget language isn't wired to locale

`AuditRequestForm.tsx` renders Turnstile with a hardcoded `theme: 'light'`
and no `language` param. Turnstile defaults to auto-detecting from the
browser, which usually lands correctly, but a plan this fastidious about
every other string (§4.4 has a dedicated `translations.ts` for form UI text)
should either explicitly pass `language: locale` for consistency or state
that auto-detection is intentional. Currently just unaddressed.

### B4. Both locales' strings ship in the client bundle regardless of which page loaded

§4.4's `translations.ts` exports `{ en: {...}, sk: {...} }` from one module;
the React island picks `translations[locale]` at runtime. Because the
lookup key isn't statically known at build time per-page, bundlers typically
can't tree-shake the unused locale out of that page's client chunk — so an
EN visitor's browser downloads the Slovak form strings too, and vice versa.
At two locales this is a handful of KB, not worth blocking on — but the
codebase's own comments elsewhere (`analytics.ts`: "keep JS budget small")
make a point of minimal JS, so this tradeoff should be a stated decision,
not something that happens quietly.

---

## C. Unverified assumptions worth checking before relying on them

### C1. The `Astro.currentLocale ?? getLocaleFromUrl(...)` fallback suggests the plan doesn't trust its own routing config

§1.3 hedges with `getContent(Astro.currentLocale ?? getLocaleFromUrl(Astro.url))`
rather than just `getContent(Astro.currentLocale)`. With `prefixDefaultLocale:
false` and both locales declared, `Astro.currentLocale` should resolve
correctly on every prerendered route in Astro 7 — including the asymmetric
root-vs-`/sk/` case this project needs. If there's a specific known gap
that justifies the manual fallback, name it in the plan; if not, drop the
redundant helper — an untested "just in case" fallback path is itself a
place bugs hide.

### C2. R1/R2 DoD gates have no owner or mechanism, same gap flagged in the build-plan review

`docs/web-dev-studio-build-plan-review-v2.md` (§C3) already flagged that
"Definition of Done" items with no CI check behind them are aspirational.
This plan's Phase i18n-8 repeats the pattern: "Slovak speaker reviews all SK
copy," "Slovak legal counsel reviews SK legal pages" are checkboxes with no
named owner, no date, and nothing in CI that blocks a merge until they're
checked. Given this is the second plan in this project to hit the same gap,
it's worth fixing once at the process level — e.g., a PR template checklist
or a required GitHub issue — rather than re-listing unenforced checkboxes
per plan.

---

## D. Nitpicks

- Cross-locale anchor nav isn't addressed: `Header.astro`'s nav items are
  in-page hash links (`#services`, `#examples`, etc., from `site.ts`). The
  `getAlternatePath` helper (§7.2) only rewrites the path prefix — if a user
  is on `/sk/#pricing` and switches to EN, the mapped path is `/#pricing`,
  which is correct only because both pages share identical section IDs.
  Worth stating explicitly that section anchors must stay locale-invariant
  (they already do, since they're not translated), so nobody "helpfully"
  localizes an anchor ID later and quietly breaks the switch.
- `/sk/og.png` and a SK-specific favicon are listed under "Nice to have"
  (§15) but §5.5's `og:locale: sk_SK` implies a properly localized card;
  shipping the EN OG image with SK metadata is a minor but visible
  inconsistency on first share to Slovak audiences.
- §9.1's `lastUpdated` handling ("same as EN, or updated when SK legal
  review changes the content") is ambiguous — pick one deterministically
  (recommend: SK legal pages get their own `lastUpdated`, since legal review
  timing will not match EN's).
- Umami Cloud locale dimension (§8, open item in §15) — confirm plan tier
  before relying on it; if it requires an upgrade, decide now whether
  locale-split analytics is worth the cost or whether `service_card_click`-style
  event props are enough without a full dimension.

---

## Priority order if patching before implementation

1. Simplify or properly test the auto-redirect referrer guard (A1) and add
   the "direct navigation, empty referrer, Slovak browser" case to the DoD
   checklist explicitly.
2. Restructure content files into locale-nested bundles _before_ writing
   `getContent()` or `check-translations.ts` against them (A2, A3) — do this
   as its own visible step in Phase i18n-1, not folded into "minimal refactor."
3. Fix `en_EU`/`en-EU` → a real locale code while touching those lines for
   SK anyway (A5) — otherwise the hreflang DoD gate will fail on the EN side.
4. Drop the enum backwards-compat dual-field hedge (A6) — no real webhook
   consumer exists yet to protect.
5. Build the CI content guard from scratch in Phase i18n-7, budgeted as new
   work (A4).
6. Decide and document the missing-translation build-fail scope (B1) and the
   mobile language-switch placement (B2) before those phases start.

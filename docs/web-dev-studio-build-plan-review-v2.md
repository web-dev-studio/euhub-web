# Web Dev Studio by EUHUB — Build Plan v2 Review (Round 2)

Review target: `docs/web-dev-studio-euhub-website-plan.md` (v2, post-review-1)
Context: v2 claims all 17 points from `web-dev-studio-build-plan-review.md` were adopted. They largely were — the business/conversion layer is now solid. This pass looks for what v2 still gets wrong, mostly at the Cloudflare/Astro runtime level and in a few places where the sales narrative contradicts itself.

---

## Executive verdict

v2 is a real improvement over v1: Phase 0 conversion architecture, Definition of Done, security headers, Turnstile, and the Engagement Models section all landed. The engineering _structure_ is good.

But there's one architecture decision — `output: "server"` — that quietly breaks three things the plan cares about (performance, the security-headers file, the sitemap), a couple of Cloudflare env-var footguns that would ship a form that silently drops every lead, and several spots where the sales copy argues with itself (a "low-friction" 11-field form, a "Work" nav item pointing at fictional examples, four different taxonomies of the same service catalog).

None of this demotes the plan. It means: fix these before generating code, because most of them are cheap now and expensive after 13 sections exist.

---

## A. Will actually break

### A1. `output: "server"` is the wrong mode, and the given reason is false

Plan line 20: `output: "server"` — "API route requires it."

Since Astro 5, it doesn't. Default `output: "static"` + the Cloudflare adapter + `export const prerender = false` on just `pages/api/audit-request.ts` gives you a static site with one dynamic route. Choosing full server mode instead:

- **Kills the performance pitch.** Every HTML page becomes a Worker invocation instead of a static asset served from edge cache. The whole site is selling "fast, static-first" while quietly rendering itself dynamically.
- **Silently defeats `public/_headers`.** Cloudflare Pages applies `_headers` to static assets only, not to Function/Worker responses. In server mode, all HTML comes from the Function — so the security-headers file the plan spent a whole subsection on does nothing for actual pages. It would need to be re-implemented as Astro middleware, undocumented in the current plan.
- **Breaks the sitemap.** `@astrojs/sitemap` only includes prerendered routes. Full server mode with no explicit `prerender` flags can emit an empty or wrong sitemap.

**Fix:** static output, single non-prerendered API route. This is the highest-priority change in the whole review.

### A2. `import.meta.env.WEBHOOK_URL` won't exist at runtime on Cloudflare

Plan line 184. `import.meta.env` values are inlined at **build time**. Secrets set in the Cloudflare Pages dashboard are **runtime** bindings, read via `locals.runtime.env` (or the `astro:env` schema with `access: "secret"`). As specced, the endpoint deploys with `WEBHOOK_URL === undefined` and every lead silently vanishes — the exact failure mode the plan explicitly says to avoid ("no silent webhook failures").

### A3. Missing `PUBLIC_` prefixes in `.env.example`

`TURNSTILE_SITE_KEY` (needed client-side for the widget) and the `UMAMI_*` values (rendered into a client `<script>` tag) must be prefixed `PUBLIC_` or Astro won't expose them to the browser bundle. As written, the Turnstile widget can't render. Also add Cloudflare's public Turnstile test keys (e.g. `1x00000000000000000000AA`) so local dev/CI never need real secrets.

### A4. "Basic IP/UA rate-limit strategy" isn't actually a strategy

Workers isolates don't share memory across requests/colos — an in-code counter does nothing. Name a real mechanism instead: a Cloudflare WAF rate-limiting rule scoped to `/api/audit-request` (available on the free tier), not application code. Saying "we rate-limit" without one is the same credibility risk as the fake-numbers rule elsewhere in the plan.

### A5. No fallback if the webhook is down

Single webhook, no retry, no secondary channel. If it's down for an hour, those leads are gone — and leads are the entire point of the page. Minimum bar: the error state shows a direct `mailto:` fallback. Better: on failure, log/stash the payload (KV) and alert. (Review 1 originally suggested an email fallback; v2 dropped it.)

### A6. `bun.lockb` is a deprecated format

Bun moved to the text-based `bun.lock` starting 1.2. Small, but jars with a plan that prides itself on precision. Also: `.dist`/`dist` on line 234 reads as a typo/uncertainty — pick the one Cloudflare's Astro adapter actually emits and state it plainly.

---

## B. Undermines the sales pitch

### B1. "Low-friction first step" vs. an 11-field form

Line 110 calls the CTA form "low-friction"; line 174 specs 11 fields (name, company, work email, current site, company size, project type, main problem, budget, timeline, decision role, message). That's a qualification interrogation, which is a legitimate strategy — but not a low-friction one, and the plan never states **which fields are required**. That's the single highest-leverage decision on the page and it's currently unspecified.

Recommendation: required = name, work email, project type, message; everything else optional. Consider a two-step form (email + project type first, qualification second) to protect the micro-conversion.

### B2. Nav says "Work," the section is admittedly fictional

Header nav (line 152) still says "Work," pointing at a section the plan itself renamed to "Example Project Scenarios" specifically to avoid implying a real portfolio (line 26, and all of review 1 §11). A nav label promising a portfolio that lands on labelled fiction reopens the exact credibility gap the rename closed. Rename the nav item too.

### B3. Secondary CTA is still an unresolved fork

Line 28: `"See What We Build" / "View Services"` — a slash, not a decision, in a table titled "Resolved decisions." Pick one. Note "See What We Build" has the same portfolio-implication problem as B2.

### B4. Animated counters with nothing real to count

Phase 7 lists "animated counters" but the site has no clients, no metrics, and a standing rule against fake numbers. The only honest counters available are the page's own: Lighthouse score, JS payload size, TTFB. Suggest turning this into a real, self-referential proof section — or cutting counters entirely.

### B5. Permanent "SK — Coming soon" is an anti-signal, not a feature

A control that's been disabled since launch day announces "unfinished" indefinitely; no visitor misses a switch that isn't there. Drop it until real SK copy exists, then add the route and hreflang together. Related tension worth naming out loud: the trust line says "Based in Slovakia" while offering zero Slovak content — acceptable for v1, but the plan should say so rather than imply otherwise via a disabled switch.

### B6. Four taxonomies of the same service catalog

Services (7 cards), Offer hierarchy (10 items), Project-type form enum (11 items), and Engagement Models (6 items) all slice the same underlying list of things-you-can-buy in different ways. Engagement Models in particular duplicates Services instead of describing _how you buy_ (fixed-price audit → fixed-scope project → monthly retainer, each with a price orientation). Four near-identical lists reads as inconsistency, not thoroughness.

### B7. Ecosystem section is an exit ramp right before the form

Section 9 (four outbound brand cards) sits directly before section 11 (the CTA + form) — an off-ramp immediately before checkout. Move Ecosystem below the CTA/footer area, and open those links in new tabs.

### B8. No design-direction checkpoint

Phase 3 goes straight from Tailwind tokens to building all 13 sections in Phase 4. Given the prompt's central fear is "generic template smell," skipping a design-reference/critique step before mass-producing sections is how AI-generated sites end up looking like AI-generated sites. Also still unresolved: the actual typeface (not just "strong modern sans-serif") and font sourcing — self-host via Fontsource, both for performance and because Google Fonts' CDN has documented GDPR exposure (per German court rulings on IP transfer to Google).

---

## C. Claims the site can't yet back up

### C1. GDPR gap inside the GDPR-aware form

The audit form collects personal data and ships it to an undisclosed third-party webhook — that's processing via a processor, and Art. 13 requires a notice at the point of collection. The current spec has no privacy-notice line near the form, and the legal-pages plan doesn't require naming processors (webhook host, Umami host, Cloudflare) or retention period. For a site whose Tech Stack section literally advertises "EU data residency options," this can't stay a TODO.

### C2. Umami hosting location is unresolved

Cloud (which region?) vs. self-hosted EU — the plan lists env vars for it but never decides where it runs, which is exactly the kind of ambiguity the GDPR-aware pitch can't afford.

### C3. Definition of Done isn't wired to anything enforcing it

DoD requires Lighthouse 95+ (mobile+desktop) and validated form success/error/timeout states, but Lighthouse CI and Playwright are both listed as "optional" in Phase 9. A DoD item with no check behind it is aspirational. Make one Playwright smoke test (form happy path + simulated webhook failure) and one Lighthouse CI run required; everything else can stay optional.

### C4. SEO ambition needs a reality caveat

One page won't rank for 6 primary + 8 secondary keywords, and "web development Slovakia" with zero Slovak content is a stretch. Fine for a v1 launch — but say so explicitly in the plan, so early traffic (ecosystem referral, direct, outbound) isn't later judged against organic-ranking expectations it was never going to meet.

---

## D. Nitpicks

- No 404 page in the page list — default Cloudflare 404 is a bad look on a proof-of-competence site. Also missing: favicon set / `site.webmanifest` (only `og.png` is listed).
- `Strict-Transport-Security ... preload` (line 218) is semi-irreversible and domain-wide; don't ship `preload` on day one of a new domain. Add `X-Frame-Options: DENY` (or CSP `frame-ancestors`) now rather than deferring all of CSP — most of the needed domains (`challenges.cloudflare.com` for Turnstile, the Umami host, self-hosted fonts) are already known.
- Umami doesn't natively track scroll depth or form-start; `scroll_50/90` and `audit_form_start` need custom listeners in `lib/analytics.ts` — small scope addition, worth naming so the "minimal JS" budget accounts for it.
- `public/_redirects` is scaffolded with nothing to redirect yet — fine, but note it's a placeholder.
- No phase has a time estimate; Phase 0's output (personas, conversion path, event list) has no artifact location — put it in `docs/` so it's reviewable like everything else.
- `docs/` itself is still untracked in git per repo status — commit it, since the plan calls itself "the source of truth."

---

## Priority order if patching before generating code

1. Switch to `output: "static"` + `prerender = false` on the API route (fixes perf, `_headers`, and sitemap in one move).
2. Move secrets to `locals.runtime.env`/`astro:env`; add `PUBLIC_` prefixes where needed.
3. Specify required vs. optional form fields; add a `mailto:` fallback in the form's error state.
4. Replace in-code rate limiting with a Cloudflare WAF rule.
5. Add a privacy notice at the form + name the processors in the privacy policy plan.
6. Drop the SK switch, rename the "Work" nav item, resolve the secondary-CTA fork.
7. Rewrite Engagement Models as pricing shapes, not another service list.
8. Add a design-direction checkpoint before Phase 4; pick and self-host a typeface.
9. Promote one Playwright smoke test + one Lighthouse CI run from optional to required.

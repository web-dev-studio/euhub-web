# Design Parity Checklist — build.euhub-ai.com

This repo hand-ports the EUHUB shared "Neo-Corporate" design system from **grow**
(`euhub-marketing`), the reference implementation (see also the Claude Design project
"EuHub — Neo-Corporate" for the canonical spec). Nothing enforces this automatically — no
shared package exists yet (planned: `@euhub/ui`, see CONSISTENCY-PLAN.md §4.3) — so this
checklist is **required on any PR touching `src/styles/` or `src/components/{ui,layout}/`:**

## Tokens

- [ ] No new hardcoded hex/rgba color in a component — every color is a `--*` token from
      `global.css`'s `@theme` block.
- [ ] Light-mode values unchanged: page `#f8fafc`, primary `#006b70` (teal), secondary
      `#4f46e5` (indigo). Dark-mode: page `#0d0e15`, primary `#00e5ff` (cyan), secondary
      `#7b61ff` (violet).
- [ ] Status tokens (success/warning/danger + `-bg` pairs) used **only** for form
      states/badges, never decoratively. **Accepted deviation:** `--color-status-danger`
      here is a WCAG-AA-adjusted value (`#991b1b` on `#fbe7e7`, ~7.3:1), documented inline in
      `global.css` — do not "fix" it to match a different literal without re-checking
      contrast; grow's own danger token was in fact backported _from_ this repo.
- [ ] `--term-*` tokens (terminal/CI-mockup surfaces) stay fixed-dark in both themes.

## Type

- [ ] Headings: Plus Jakarta Sans, H1 800 / H2 700 / H3 600, letter-spacing −0.02em.
- [ ] Body: DM Sans 400, line-height 1.6. Mono: JetBrains Mono for eyebrows/stats/wordmark.
- [ ] Fluid clamps unchanged: H1 `clamp(3rem, 5vw+1rem, 5.125rem)`, H2 `clamp(2rem, 3vw+1rem,
3rem)`, body `clamp(1rem, 1vw+.75rem, 1.125rem)`.

## Page frame

- [ ] Content column is `max-w-6xl` (1152px) via `Container.astro`, gutters
      `px-4 sm:px-6 lg:px-8`. **`xl`/`max-w-7xl` was deliberately removed** — it made this
      site 128px wider than grow/deploy. Do not re-add it.
- [ ] Section vertical padding `--spacing-section-y` (6rem) / `-sm` (3.5rem) on mobile.

## Header / footer anatomy

- [ ] Two-tier header: utility bar (`h-9`, mono 11px, trust line left, language + theme pills
      right) above a sticky `h-(--spacing-header-height)` (4.25rem) header on
      `grid-cols-[1fr_auto_1fr]` — logo left, **centered** nav, actions right.
- [ ] Wordmark: gradient bar + typing "BUILD" animation, `steps(5,end)` / `5.25ch` — this
      exact scaling is intentional (grow types "GROW" at `steps(4)`/`4.2ch`, deploy types
      "DEPLOY" at `steps(6)`/`6.3ch`; each is sized to its own word length).
- [ ] Language pill: EN/SK only (two locales here, not three) — `rounded-full` group,
      `aria-current` marks active, persists to `localStorage['i18n-choice']`.
- [ ] Theme pill: `role="radiogroup"`, auto / light / dark, default `auto`, pre-paint (no FOUC).
- [ ] Footer: 4-column grid (`lg:grid-cols-[1.4fr_1fr_1fr_1fr]`) — brand / Navigation /
      Ecosystem / Contact+Legal, bottom bar with copyright + language switch.

## Eyebrow pattern

- [ ] Numbered mono kicker `NN // Label`, uppercase, tracking-widest, `--primary`.
- [ ] Sequence is **contiguous `01→NN` in actual page render order**, re-verified per locale.

## CTA / components

- [ ] Buttons `rounded-full` (pill); primary carries `--shadow-glow-primary` +
      `-translate-y-0.5` hover lift on `--ease-emphasis`; secondary is outline; ghost ties to
      text-link style.
- [ ] Cards: hairline `--color-border-subtle`, radius `lg` (1rem).
- [ ] All interactive elements keep a visible 2px `--color-focus-ring` outline.

## Verification

- [ ] `bun run check` / `format:check` clean.
- [ ] Compiled-CSS grep: no stale hex values, `max-w-6xl` present, correct font-family stack.
- [ ] 1440px screenshot compare (light + dark) against the last known-good reference.
- [ ] Lighthouse gate is **currently non-enforcing** (`quality-gates.yml` has a trailing
      `|| true`) — see CONSISTENCY-PLAN.md §3.2; don't assume a green run means it passed.

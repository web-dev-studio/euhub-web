# i18n Plan v2 Review

Review target: `docs/i18n-plan-v2.md`
Context: v2 claims all 14 points from `docs/i18n-plan-review.md` are adopted.
This pass verifies each claim against the actual v2 text (not just the "A1
✓" labels) and checks the one new mechanism v2 introduces — the GitHub
Actions conditional for scoping the translation-completeness check.

---

## Executive verdict

13 of 14 points are resolved for real, not just relabeled — the content
bundle restructure is now an explicit phase, the invalid locale codes are
fixed, the webhook backwards-compat hedge is gone, the redirect guard is
simplified with a matching DoD test case added. This is a genuine second
pass, not a cosmetic one.

One new, concrete bug was introduced while fixing B1 (scoping the
translation check to SK-only changes): the proposed CI conditional calls a
function that does not exist in GitHub Actions' expression syntax. As
written, it would fail workflow validation, which typically takes the whole
CI pipeline down, not just this one step. Fix that before anyone commits
this YAML. Everything else is ready to implement.

---

## A. Will actually break

### A1 (new). The B1 fix uses a nonexistent GitHub Actions function

§10.2 / §11:

```yaml
- name: Check translation completeness (SK)
  if: contains(join(glob('src/content/sk/**'), ' '), 'src/content/sk/')
  run: bun run scripts/check-translations.ts
```

GitHub Actions expressions support a fixed function set: `contains`,
`startsWith`, `endsWith`, `format`, `join`, `toJSON`, `fromJSON`,
`hashFiles`, plus the status functions (`success`, `always`, `cancelled`,
`failure`). There is no `glob()`. An unrecognized function in an `if:`
expression fails workflow-file validation — GitHub Actions checks the whole
file before running anything, so this doesn't just skip the step, it can
invalidate the run.

The underlying goal (B1: only run the SK-completeness check when SK content
actually changed) is correct and worth keeping. The mechanism needs to be
one of:

- `dorny/paths-filter@v3` with a `sk: 'src/content/sk/**'` filter, gating on
  `steps.filter.outputs.sk == 'true'`, or
- `tj-actions/changed-files@v46` with a `files: src/content/sk/**` input,
  gating on its `any_changed` output.

Either is a few lines; don't hand-roll changed-file detection with
expression functions that don't exist.

---

## B. Resolved, confirmed correct

Quick pass confirming these aren't just relabeled:

| #          | v1 finding                                                                     | v2 resolution                                                                                                            | Verified                                                                                             |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| A1 (orig.) | Redirect referrer guard was dead weight for the primary use case               | Guard condition removed; DoD gains an explicit "direct nav, empty referrer, Slovak browser" test case (§12 Phase i18n-8) | Yes — matches the actual gap; loop prevention still covered by the path-prefix + localStorage checks |
| A2         | `getContent()` design didn't match real per-file named exports                 | §1.2 makes the bundle-object restructure an explicit, named Phase i18n-1 step, shows the actual before/after shape       | Yes                                                                                                  |
| A3         | `check-translations.ts` sample imported a shape that doesn't exist             | §10.2 explicitly defers writing it until after the A2 restructure lands                                                  | Yes                                                                                                  |
| A4         | "Existing CI grep guard" doesn't exist in `ci.yml`                             | §10 states this plainly and schedules it as new work in Phase i18n-7, plus ships the EN-only version too                 | Yes                                                                                                  |
| A5         | `en_EU` / `en-EU` aren't valid locale codes                                    | Both replaced with `en_GB` / `en-GB` throughout                                                                          | Yes, valid BCP-47/CLDR pair                                                                          |
| A6         | Backwards-compat webhook hedge protected a nonexistent integration             | Dropped; payload sends `projectTypeId` only                                                                              | Yes                                                                                                  |
| B2         | No mobile-header room for a third control                                      | Language switch moved into the mobile menu panel; sticky row keeps just ThemeToggle + hamburger                          | Yes                                                                                                  |
| B3         | Turnstile widget language not wired to locale                                  | `language: locale` added to the render call                                                                              | Yes                                                                                                  |
| B4         | Both locales' form strings ship to every client bundle                         | Stated explicitly as an accepted 2-locale tradeoff, with a revisit condition                                             | Yes — this is exactly "name the tradeoff instead of absorbing it silently"                           |
| C1         | Redundant `Astro.currentLocale ?? getLocaleFromUrl()` fallback                 | Fallback dropped; direct `getContent(Astro.currentLocale)`                                                               | Yes                                                                                                  |
| C2         | DoD gates had no owner or enforcement mechanism                                | PR template checklist + GitHub issue template added (see residual note below)                                            | Partial — mechanism exists but isn't merge-blocking, see A2 below                                    |
| D1         | Cross-locale anchor nav not addressed                                          | Explicitly stated: section anchor IDs are locale-invariant                                                               | Yes                                                                                                  |
| D2         | SK OG image was "nice to have" despite `og:locale: sk_SK` implying a full card | Promoted to required, DoD checkbox added                                                                                 | Yes                                                                                                  |
| D3         | `lastUpdated` ambiguous between EN/SK legal pages                              | SK gets its own, independent of EN                                                                                       | Yes                                                                                                  |
| D4         | Umami Cloud "dimension" tier dependency unconfirmed                            | Switched to event properties (already supported), sidesteps the tier question entirely                                   | Yes — better fix than just "confirm the tier"                                                        |

---

## C. Residual gaps (not bugs, worth tightening)

### C-1. PR-template checklist (C2) is a nudge, not a gate

`.github/pull_request_template.md` checkboxes for "Slovak speaker reviewed
copy" and "Slovak legal counsel reviewed" are text in a template — nothing
stops a PR from merging with them unchecked. For something R2 calls
**Critical** severity (legal liability), a checklist alone isn't the
strongest available control. GitHub supports path-scoped `CODEOWNERS`,
which turns "the right person must approve" into an actual required-reviewer
rule enforced by branch protection:

```
# CODEOWNERS
src/content/sk/**      @slovak-speaker-handle
**/legal.ts            @legal-reviewer-handle
```

This is a small addition on top of what's already planned and converts R1/R2
from "please remember to check the box" into "the merge button is disabled
until the named reviewer approves." Worth adding to Phase i18n-8.

### C-2. Issue template needs front matter to actually appear as a picker option

`.github/ISSUE_TEMPLATE/legal-review.md` is listed as a new file, but for
GitHub to show it in the "new issue" template chooser alongside any other
templates, it needs YAML front matter (`name:`, `about:`, `labels:`, etc.) —
a bare markdown file in that directory without front matter may not render
as a selectable template. Minor, just don't forget the front matter when
this file is actually written.

### C-3. `en_GB` implies British spelling conventions — worth a one-line copy check

Choosing `en_GB` over a region-neutral option is fine and valid, but it's an
implicit claim about the EN copy's spelling conventions ("colour," "-ise"
endings, etc.). If the existing EN copy uses American spelling anywhere,
that's now a small mismatch between the declared locale and the actual
text. Not worth blocking on — just worth a quick skim of `content/en/*.ts`
during Phase i18n-6 rather than assuming consistency.

---

## Priority order

1. Fix the `glob()` GitHub Actions expression before this YAML is committed
   anywhere (A1 above) — swap in `dorny/paths-filter` or
   `tj-actions/changed-files`.
2. Add `CODEOWNERS` entries for `src/content/sk/**` and legal content paths
   so R1/R2 review is enforced by branch protection, not just a checklist
   (C-1).
3. Remember front matter on the legal-review issue template (C-2) — trivial,
   easy to forget.

Everything else in v2 is implementation-ready.

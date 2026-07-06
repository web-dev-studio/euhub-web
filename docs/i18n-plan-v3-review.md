# i18n Plan v3 Review

Review target: `docs/i18n-plan-v3.md`
Context: v3 claims all 4 points from `docs/i18n-plan-v2-review.md` are
adopted. Verified each below, then checked whether the fix for the `glob()`
bug introduced anything new — it did.

---

## Executive verdict

All 4 prior points are genuinely fixed, not just relabeled. The `glob()` →
`dorny/paths-filter` swap is the correct action for the job. But that action
has a documented prerequisite the plan doesn't mention: it needs real git
history to diff against on `push`-triggered runs, and the repo's existing
checkout step is shallow. Fix that one line and this plan is
implementation-ready.

---

## A. Confirmed resolved

| #   | v2 finding                                                           | v3 resolution                                                                                                                                                            | Verified                                                                                                                              |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `glob()` isn't a valid GitHub Actions expression function            | Replaced with `dorny/paths-filter@v3`, filter scoped to `src/content/sk/**`, gated on `steps.filter.outputs.sk == 'true'`                                                | Yes — correct, standard usage of the action                                                                                           |
| 2   | CODEOWNERS-as-enforcement was suggested but not written              | `.github/CODEOWNERS` added for `src/content/sk/**` and `**/legal.ts`; placeholder handles explicitly flagged in §15 as needing real GitHub usernames before this is live | Yes — appropriately incomplete (can't know real handles at planning time) but correctly tracked as an open item, not silently assumed |
| 3   | Issue template needed YAML front matter to appear in GitHub's picker | `name`/`about`/`labels` front matter shown in §12 Phase i18n-8                                                                                                           | Yes                                                                                                                                   |
| 4   | `en_GB` implies British spelling; worth a copy consistency check     | Added as an explicit Phase i18n-6 step and a DoD checklist item, with a concrete fallback (switch to region-neutral `en` if American spelling is found)                  | Yes                                                                                                                                   |

---

## B. New issue introduced by the A1 fix

### B1. `dorny/paths-filter` needs real git history on `push`-triggered runs; the existing checkout is shallow

§10.2's fix is the right tool, but the action has a documented behavior
split by trigger type:

- On `pull_request` events, it can resolve changed files via the GitHub API
  directly — no deep git history needed.
- On `push` events (and some other trigger types), it falls back to local
  `git diff` against the previous commit, which requires the checkout to
  have that commit available.

The repo's CI (`.github/workflows/ci.yml`) triggers on **both**:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

and its `actions/checkout@v4` step has no `with:` block — meaning
`fetch-depth: 1` (shallow, single commit) by default. On a direct push to
`main`, `paths-filter` won't have the prior commit locally to diff against,
which typically either errors or silently falls back to a wider match than
intended.

**Fix:** add `fetch-depth: 2` (or `0` for full history, safer if unsure) to
the `actions/checkout` step in the job that runs the translation-completeness
check. This is a one-line change, but the plan's file-modification list
(§13, `.github/workflows/ci.yml`) currently only mentions "dorny/paths-filter

- content guard + SK smoke test" — worth adding "+ fetch-depth on checkout"
  explicitly so it isn't dropped during implementation.

---

## C. Minor residual note (non-blocking)

### C1. D4's Umami claim went from "confirm" to asserted without new evidence

v2 said: "Confirm Umami Cloud plan tier supports custom properties... if a
dimension requires an upgrade, event properties are sufficient." v3 flattens
this to: "Event properties are supported on all Umami Cloud tiers — no
dimension upgrade needed," and drops the corresponding "confirm plan tier"
line from §15's open items entirely.

Event-level properties are a core open-source Umami feature and unlikely to
be tier-gated, so this is probably fine — but the open item was removed
without a stated reason for the added confidence. If this was actually
checked against the current Umami Cloud pricing page, say so in the plan;
if not, it costs nothing to leave one line in §15 rather than silently
dropping the verification step.

---

## Priority order

1. Add `fetch-depth: 2` (or `0`) to the `actions/checkout` step feeding the
   `dorny/paths-filter` job (B1) — the one thing that would actually break
   on a real push to `main`.
2. Optional: restore a one-line "confirm this wasn't just asserted"
   footnote on the Umami claim (C1), or explicitly note it was verified.

Everything else in v3 is ready to implement.

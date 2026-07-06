# Conversion Architecture — Web Dev Studio by EUHUB

This document defines how the page converts visitors into leads. It is the
business layer that the section components implement. Written before code
per the v3 build plan (Phase 0).

---

## 1. Visitor personas

| Persona | Pain | What they need to see | Primary CTA |
|---|---|---|---|
| **Founder / owner** | Outdated website, no leads, no technical owner | Credibility, business outcomes, clear first step | Request Web Audit |
| **Operations manager** | Manual processes, no integrations, fragmented tools | API/integration competence, portals, dashboards | Request Web Audit |
| **Marketing manager** | Slow site, poor SEO, weak conversion structure | Performance, conversion architecture, analytics | Request Web Audit |
| **Technical decision-maker** | Fragile stack, no DevOps, no path to AI | Engineering depth, tech stack, architecture | Request Web Audit |

---

## 2. Conversion path

```
Visitor → Hero (understand offer) → Problem (urgency) → Services (map need to offer)
  → Differentiation (prove engineering-led) → Process (reduce risk)
  → Tech Stack (prove depth) → Example Scenarios (proof-like context)
  → Engagement Models (pre-qualify on scope/budget) → CTA + Form (convert)
  → [post-submit] Qualification → Discovery call → Proposal
```

Secondary paths (non-form conversions):
- Click ecosystem link → enters EUHUB.AI or EUHUB.CO funnel
- Click email → direct contact
- Click service card → deeper engagement with a specific offer

---

## 3. Offer hierarchy

Ordered from low-friction entry to high-scope engagement:

1. **Technical Web Audit** — the entry offer (primary CTA)
2. **Landing Page** — single campaign page
3. **Business Website** — multi-page marketing site
4. **Website Redesign** — rebuild of an existing site
5. **Custom Web Application** — dashboards, portals, internal tools
6. **AI-integrated Web Interface** — RAG, copilots, automation UIs
7. **API / CRM / ERP Integration** — connecting systems
8. **Maintenance & DevOps Retainer** — long-term care

---

## 4. Engagement models (pricing shapes, not another service list)

| Shape | How it works | Price orientation |
|---|---|---|
| **Technical Web Audit** | Fixed-price, 1-week diagnostic | €500–€1,500 (one-time) |
| **Fixed-scope project** | Defined deliverables, agreed timeline | €3,000–€25,000+ (project) |
| **Monthly retainer** | Maintenance, DevOps, iterations, monitoring | €500–€3,000/month |

---

## 5. Trust signals

- EU-based, Slovakia/EU location
- GDPR-aware architecture
- Engineering-led (not a template shop)
- API / backend / DevOps competence
- Legacy integration capability including SOAP
- Performance-first (the site itself is the proof)
- Parent ecosystem: EUHUB.CO, EUHUB.AI, EUHUB.SK

---

## 6. Measurable events (Umami, cookieless)

| Event name | Trigger | Section |
|---|---|---|
| `cta_primary_click` | Click "Request Web Audit" | Hero, CTA section, header |
| `cta_secondary_click` | Click "View Services" | Hero |
| `audit_form_start` | First field focus | CTA section |
| `audit_form_submit_success` | Form returns 200 | CTA section |
| `audit_form_submit_error` | Form returns error | CTA section |
| `service_card_click` | Click a service card | Services |
| `faq_open` | Open a FAQ item | FAQ |
| `ecosystem_link_click` | Click an EUHUB brand card | Ecosystem |
| `email_click` | Click mailto link | Footer, CTA error fallback |
| `scroll_50` | 50% scroll depth | Page-wide |
| `scroll_90` | 90% scroll depth | Page-wide |

Custom listeners required in `lib/analytics.ts` for:
`audit_form_start`, `scroll_50`, `scroll_90` (Umami doesn't track these natively).

---

## 7. Lead qualification — form fields

**Required (4):** name, work email, project type, message
**Optional (7):** company, current website, company size, main problem,
budget range, timeline, decision role

Form shape: single form, 4 required + 7 optional. Protects the
micro-conversion while still enabling qualification.

### Enums

**Project type:**
Technical Web Audit · Landing Page · Business Website · Website Redesign ·
Custom Web Application · Client Portal · Internal Dashboard ·
AI-integrated Web Interface · API/CRM/ERP Integration · Maintenance/DevOps ·
Not sure yet

**Budget range:**
< €2,500 · €2,500–€5,000 · €5,000–€10,000 · €10,000–€25,000 · €25,000+ ·
Not sure yet

**Timeline:**
ASAP · Within 1 month · 1–3 months · 3–6 months · Just researching

**Decision role:**
Owner/Founder · Technical decision-maker · Marketing/Growth · Operations ·
Project manager · Other

---

## 8. Section-to-conversion mapping

| # | Section | Job |
|---|---|---|
| 1 | Header | Navigation + persistent CTA |
| 2 | Hero | Explain offer + outcome → primary CTA |
| 3 | Problem | Create urgency ("the system behind it is") |
| 4 | Services | Map business needs to 7 offers |
| 5 | Differentiation | Prove engineering-led (5-layer stack) |
| 6 | Process | Reduce perceived risk (5 steps) |
| 7 | Tech Stack | Prove engineering depth (categorized grid) |
| 8 | Example Scenarios | Proof-like context (labelled examples) |
| 9 | Engagement Models | Pre-qualify on scope/budget (pricing shapes) |
| 10 | Self-referential proof | Site proves its own performance claims |
| 11 | CTA + Form | Primary conversion event |
| 12 | EUHUB Ecosystem | Credibility via parent brands (below CTA, opens new tabs) |
| 13 | FAQ | Remove residual objections |
| — | Footer | Legal + ecosystem links + contact |

---

## 9. Fallback / error recovery

If the webhook is down or the form submission fails:
- **Primary recovery:** error state shows a direct `mailto:` link with the
  audit request pre-filled in the subject/body.
- **Optional (deferred):** KV stash the payload on failure + alert. Documented
  as a post-launch enhancement, not built in v1.

---

## 10. SEO reality caveat

One page will not rank for 6 primary + 8 secondary keywords.
"Web development Slovakia" with zero Slovak content is a stretch.
**v1 traffic expectation:** ecosystem referral + direct + outbound.
Organic ranking is a long-term outcome, not a launch metric.

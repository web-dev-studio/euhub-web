# Web Dev Studio by EUHUB — Website/Landing Page Creation Prompt

Prepared for: **web-dev-studio.com**  
Parent ecosystem: **EUHUB.CO / EUHUB AI / EUHUB.SK**  
Recommended purpose: premium web development studio landing page and lead-generation site.

---

## Strategic Recommendation

The new website should not feel like a disconnected freelance portfolio or generic web agency page.

It should be positioned as:

> **Web Dev Studio by EUHUB builds premium websites and web applications for European companies that need more than a digital brochure.**

This positions the studio as a specialized engineering unit inside the EUHUB ecosystem.

The core value proposition should focus on:

- Modern websites
- Landing pages
- Custom web applications
- Dashboards
- Client portals
- AI-integrated web interfaces
- API-connected business systems
- Long-term maintenance and DevOps support
- GDPR-aware EU-focused delivery

Avoid weak messaging such as:

- “We create beautiful websites”
- “We bring your vision to life”
- “Cutting-edge digital experiences”
- “Pixel-perfect solutions”
- “Innovative web design”

Use stronger, business-oriented language:

- “Fast, secure, conversion-focused web platforms”
- “AI-ready interfaces”
- “API-integrated business systems”
- “Maintainable production software”
- “GDPR-aware architecture”
- “Technical ownership after launch”

---

## Recommended Domain Structure

| Purpose                            | Domain                                                      |
| ---------------------------------- | ----------------------------------------------------------- |
| Main public landing page           | `web-dev-studio.com`                                        |
| EUHUB AI ecosystem subdomain       | `studio.euhub-ai.com`                                       |
| Corporate ecosystem reference page | `euhub.co/web-dev-studio`                                   |
| Optional AI-related service page   | `euhub-ai.com/custom-web-apps` or `euhub-ai.com/web-studio` |

Recommended structure:

```text
web-dev-studio.com              -> main public landing page
studio.euhub-ai.com             -> mirrored or redirected version
euhub.co/web-dev-studio         -> corporate ecosystem reference page
```

---

## Recommended CTA Strategy

Primary CTA:

> **Request Web Audit**

Secondary CTA:

> **See What We Build**

Optional tertiary CTA:

> **Explore EUHUB AI**

Avoid using only “Contact us” as the main CTA. It is too generic and weak. “Request Web Audit” gives the visitor a concrete first step and creates a stronger conversion path.

---

## Recommended Technical Stack

For a marketing landing page, prefer a static-first architecture.

### Preferred stack

- Astro 7 or latest stable Astro
- React islands for interactive components
- TypeScript
- Tailwind CSS v4
- Motion for React
- GSAP only for selected advanced interactions
- Optional Three.js / Spline / React Three Fiber only if lazy-loaded
- MDX or structured JSON content
- Cloudflare Pages, Vercel, or EU-hosted deployment

### Alternative stack

Use Next.js 16 App Router only if the project will include:

- Authentication
- Client portal
- Admin dashboard
- Preview mode
- API routes
- App-like functionality
- Complex server-side logic

For a landing page, Astro is usually better because it keeps JavaScript smaller and performance higher.

---

## Performance Requirements

Target Lighthouse scores:

- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Implementation requirements:

- Mobile-first responsive design
- Static rendering where possible
- Lazy-loaded heavy animation and 3D assets
- No render-blocking animations
- Support `prefers-reduced-motion`
- No layout shift
- Optimized images
- Semantic HTML
- Small JavaScript payload
- No heavy animation on mobile
- Strong accessibility foundations

---

## Master Prompt

Use the following prompt with Antigravity, Cursor, Claude Code, Lovable, v0, Bolt, or another AI coding agent.

---

# Prompt: Create a Modern Light-Theme Website for Web Dev Studio by EUHUB

You are a senior product designer, creative front-end engineer, technical SEO specialist, and B2B conversion strategist.

Create a production-ready modern light-theme website/landing page for **web-dev-studio.com**, a specialized web development studio operated as part of **EUHUB.CO** and connected to the EUHUB AI ecosystem.

The website must communicate that this is not a generic web agency. It is a high-end engineering studio for serious companies that need fast, secure, scalable, business-focused web platforms, landing pages, dashboards, portals, AI-integrated web apps, and custom software interfaces.

---

## Brand Context

The new website must visually and strategically connect to the EUHUB ecosystem:

- **EUHUB.CO**: corporate parent brand, European AI/software consulting, GDPR-first, EU-resident infrastructure, custom engineering.
- **EUHUB AI**: agentic AI implementation, automation, workflow audits, AI systems, custom web apps.
- **EUHUB.SK**: Slovak IT community, incubator, coworking, business support, relocation, legal/accounting support.

The new site must position **web-dev-studio.com** as the web engineering and digital product studio inside the EUHUB ecosystem.

Primary message:

> We build modern web systems that look premium, load fast, integrate with your business, and are engineered for long-term growth.

Avoid sounding like a generic design agency. Avoid vague claims like “we create beautiful websites.” Focus on engineering, performance, business workflows, security, integrations, automation, AI-readiness, and measurable outcomes.

---

## Target Audience

The target audience includes:

- Small and medium-sized companies in the EU
- Logistics, healthcare, legal, accounting, B2B services, industry, and SaaS companies
- Founders who need serious technical execution
- Companies with outdated websites
- Companies needing custom dashboards, portals, or internal tools
- Businesses that want AI-ready web infrastructure
- Non-technical decision-makers who still care about reliability, performance, and trust

Tone:

- Premium
- Technical but understandable
- Confident
- Clean
- European
- Direct
- No hype
- No startup-bro exaggeration
- No vague agency clichés

---

## Goal of the Website

The website must convert visitors into leads for:

1. Modern business websites
2. Landing pages
3. Custom web applications
4. AI-integrated web systems
5. Client portals
6. Internal dashboards
7. Automation-ready web platforms
8. Technical website audits
9. Website redesign and migration
10. Long-term maintenance and DevOps support

Primary CTA:

> Request Web Audit

Secondary CTA:

> See What We Build

Optional tertiary CTA:

> Explore EUHUB AI

---

## Technical Stack

Build the site using a modern 2026-ready production stack.

Preferred stack:

- Astro 7 or latest stable Astro
- React islands for interactive components
- TypeScript
- Tailwind CSS v4
- Motion for React for component-level animations
- GSAP for selected advanced hero/scroll/text interactions only
- Optional Three.js or Spline scene, lazy-loaded and disabled on low-power/mobile devices
- MDX or structured JSON content files
- Fully responsive layout
- Static-first architecture
- Minimal JavaScript by default
- Progressive enhancement
- Accessibility-first implementation

Alternative acceptable stack:

- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS v4
- Motion
- GSAP where justified

Choose Astro if the project is primarily a marketing website. Choose Next.js only if building app-like functionality, dashboards, authentication, preview mode, advanced API routes, or future portal features.

---

## Performance Requirements

The website must be fast and production-grade.

Requirements:

- Lighthouse Performance target: 95+
- Lighthouse Accessibility target: 95+
- Lighthouse Best Practices target: 95+
- Lighthouse SEO target: 95+
- Mobile-first responsive design
- Use static rendering wherever possible
- Lazy-load heavy animation/3D assets
- Do not block initial render with animations
- Respect `prefers-reduced-motion`
- Avoid layout shift
- Use optimized images
- Use modern image formats
- Use semantic HTML
- Keep JavaScript payload small
- Avoid heavy animation on mobile
- Use CSS animations where enough
- Use Motion/GSAP only where they add clear value

---

## Visual Style

Create a premium light-theme visual identity.

Design direction:

- Background: warm white, soft gray, or subtle off-white
- Typography: strong modern sans-serif, highly readable
- Accent color: EU/tech-inspired blue, electric cyan, or deep violet
- Secondary accents: soft green or amber only for status/data indicators
- Layout: spacious, precise, grid-based
- Visual language: technical diagrams, cards, code panels, browser frames, system architecture blocks, subtle data grid overlays
- UI style: clean glass cards, thin borders, soft shadows, blurred panels, premium SaaS aesthetic
- Avoid dark cyberpunk overload
- Avoid cheap neon everywhere
- Avoid random stock photos
- Avoid fake 3D blobs unless they support the concept

The page should feel like:

- European engineering studio
- Premium SaaS product site
- AI/web systems consultancy
- Modern development lab
- Clean technical confidence

It must not feel like:

- Freelancer portfolio
- Template agency
- Crypto landing page
- Generic Webflow clone
- Overanimated award-site that nobody can read

---

## Animation Direction

Use animation carefully.

Required animation ideas:

1. Hero section:
   - Subtle animated grid or technical background
   - Floating browser/app preview cards
   - Code-to-interface transformation
   - Light motion, not chaotic

2. Services section:
   - Cards with hover-only desktop effects
   - On mobile, no hover-dependent UX

3. Process section:
   - Scroll-triggered reveal of steps
   - Simple timeline or architecture flow

4. Proof/metrics section:
   - Animated counters only when visible
   - No fake numbers unless marked as examples

5. Case-study preview:
   - Interactive cards showing before/after transformation

Rules:

- Animations must support comprehension
- Do not animate every element
- No scroll hijacking
- No annoying parallax
- No CPU-heavy effects on mobile
- Respect accessibility and reduced-motion settings

---

## Page Structure

Create the following landing page sections.

---

### 1. Header

Header must include:

- Logo / wordmark: Web Dev Studio by EUHUB
- Navigation:
  - Services
  - Work
  - Process
  - Tech Stack
  - FAQ
  - Contact
- CTA button:
  - Request Web Audit

Header behavior:

- Sticky on desktop
- Compact on mobile
- Smooth anchor navigation
- Clear language switch placeholder: EN / SK
- Optional links to EUHUB.CO and EUHUB AI

---

### 2. Hero Section

Hero must immediately explain the offer.

Headline options to choose from:

Option A:

> Modern web systems for companies that outgrew template websites.

Option B:

> Premium websites, web apps, and AI-ready interfaces for European businesses.

Option C:

> We build fast, secure, conversion-focused web platforms for serious companies.

Subheadline:

> Web Dev Studio by EUHUB designs and engineers modern websites, landing pages, dashboards, client portals, and AI-integrated web applications with performance, security, and business logic built in from day one.

Primary CTA:

> Request Web Audit

Secondary CTA:

> View Services

Trust line:

> Based in Slovakia. Built for EU businesses. GDPR-aware by default.

Hero visual:

Create a premium interactive browser mockup showing:

- Landing page preview
- API integration cards
- AI assistant module
- Dashboard chart
- Performance score indicator
- Deployment pipeline status

Use light theme. Make it look like a real engineered system, not decorative nonsense.

---

### 3. Problem Section

Title:

> Your website is probably not the real problem. The system behind it is.

Explain that many companies suffer from:

- Slow outdated websites
- Weak conversion structure
- No CRM integration
- No analytics discipline
- No automation
- Poor mobile UX
- Poor SEO foundations
- No technical ownership
- No path toward AI integration
- Random plugins and fragile WordPress setups

Write this section in a direct but professional tone.

---

### 4. Services Section

Title:

> What we build

Create service cards for:

1. Modern business websites
   - Fast, responsive, SEO-ready websites for companies that need credibility and lead generation.

2. Landing pages
   - Conversion-focused campaign pages for services, products, events, and audits.

3. Custom web applications
   - Internal tools, dashboards, booking systems, portals, and operational interfaces.

4. AI-integrated web interfaces
   - Frontends for AI assistants, RAG systems, automation workflows, and internal copilots.

5. Website redesign and migration
   - Rebuild outdated websites into modern, maintainable, high-performance systems.

6. API and business integrations
   - CRM, ERP, payment, email, analytics, logistics, and internal database integrations.

7. Maintenance and DevOps
   - Hosting, CI/CD, monitoring, security updates, backups, and long-term care.

Each card should include:

- Short title
- One-sentence explanation
- Small technical icon
- Hover interaction on desktop
- No excessive animation

---

### 5. Differentiation Section

Title:

> Design is only the visible layer.

Explain that EUHUB Web Dev Studio combines:

- UX design
- Front-end engineering
- API integration
- Backend architecture
- AI-readiness
- Security and compliance awareness
- DevOps and deployment
- Analytics and conversion tracking

Create a layered visual:

- Layer 1: Visual interface
- Layer 2: Business logic
- Layer 3: API integrations
- Layer 4: Data and automation
- Layer 5: Hosting, monitoring, security

Message:

> A serious website is not a brochure. It is part of your business infrastructure.

---

### 6. Process Section

Title:

> From audit to launch without chaos

Create a 5-step process:

1. Diagnostic
   - We review your website, offer, users, technical stack, analytics, and bottlenecks.

2. Architecture
   - We define sitemap, content structure, integrations, data flows, and technology choices.

3. Design system
   - We create the visual language, components, UI patterns, and responsive structure.

4. Engineering
   - We build the frontend, backend/API integrations, CMS/content model, analytics, and deployment pipeline.

5. Launch and improve
   - We deploy, monitor, measure, iterate, and maintain.

Each step should include deliverables.

---

### 7. Tech Stack Section

Title:

> Built with modern engineering standards

Include the following categories.

Frontend:

- Astro
- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
- GSAP

Backend/API:

- Node.js
- Rust where performance or system-level reliability is needed
- REST APIs
- GraphQL where appropriate
- SOAP integrations when legacy systems require it
- PostgreSQL
- Redis
- Webhooks

AI-ready systems:

- RAG interfaces
- AI assistant UIs
- Workflow automation
- Secure document processing
- Human-in-the-loop review flows

DevOps:

- Docker
- CI/CD
- GitHub Actions
- Cloudflare
- GCP EU regions
- Monitoring
- Logging
- Backups

Compliance/security:

- GDPR-aware architecture
- EU data residency options
- Secure forms
- Role-based access where needed
- Audit-friendly logging for business apps

Do not turn this into a boring wall of logos. Use elegant technical cards or a structured grid.

---

### 8. Case Study Preview Section

Create three fictional but realistic case-study cards. Mark them as examples if real case studies are not provided.

Case study examples:

1. Logistics company
   - Problem: outdated website and manual quote requests
   - Solution: modern landing page, quote form, CRM integration, dashboard
   - Result: faster lead handling and cleaner operations

2. Medical/logistics service
   - Problem: fragmented internal communication
   - Solution: secure portal, role-based dashboards, AI-assisted document handling
   - Result: reduced manual coordination

3. B2B services company
   - Problem: low trust and weak conversion
   - Solution: premium website, SEO structure, analytics, lead funnel
   - Result: better-qualified inbound requests

Use realistic metrics only if clearly labelled as illustrative.

---

### 9. EUHUB Ecosystem Section

Title:

> Part of the EUHUB engineering ecosystem

Explain:

- Web Dev Studio focuses on websites, landing pages, portals, and web applications.
- EUHUB AI focuses on AI audits, automation, and agentic systems.
- EUHUB.CO is the corporate umbrella for software, AI, and digital transformation.
- EUHUB.SK supports the local tech community and business ecosystem in Slovakia.

Create clean cards linking these brands conceptually.

---

### 10. CTA Section

Title:

> Start with a technical web audit.

Copy:

> We will review your current website, positioning, speed, structure, conversion flow, integrations, and technical risks. You get a clear list of what to fix, what to rebuild, and what is not worth touching.

CTA:

> Request Web Audit

Secondary CTA:

> Contact EUHUB

Include a short contact form:

Fields:

- Name
- Company
- Work email
- Current website
- What do you need?
- Budget range
- Timeline
- Message

Form requirements:

- Accessible labels
- Validation
- Spam protection
- Success state
- Error state
- Webhook/API-ready structure
- Do not use fake submission only; create a clear integration placeholder

---

### 11. FAQ Section

Create FAQ items:

1. Do you only build websites?
2. Can you build custom web apps or dashboards?
3. Can you integrate with our CRM/ERP?
4. Can you work with legacy SOAP APIs?
5. Do you build AI features?
6. Can you host and maintain the website?
7. Are you GDPR-aware?
8. Do you work with companies outside Slovakia?
9. How long does a website project take?
10. What do you need from us to start?

Answers must be concise, practical, and business-focused.

---

### 12. Footer

Footer must include:

- Web Dev Studio by EUHUB
- Short description
- Links:
  - Services
  - Process
  - Tech Stack
  - Contact
  - EUHUB.CO
  - EUHUB AI
  - EUHUB.SK
- Contact email placeholder
- Location: Slovakia / European Union
- Privacy Policy
- Cookie Policy
- Terms
- Copyright

---

## Content Requirements

Write all copy in polished English.

Style:

- Clear
- Direct
- Premium
- Technical but understandable
- No empty marketing phrases
- No cliché agency language
- No exaggerated claims
- No fake testimonials
- No fake client logos unless placeholders are clearly marked

Use short paragraphs.

Use strong section headlines.

Use concrete wording like:

- API integrations
- AI-ready interfaces
- GDPR-aware architecture
- Fast loading
- Secure deployment
- Conversion structure
- Business workflows
- Maintainable codebase
- Long-term technical ownership

Avoid weak wording like:

- Innovative solutions
- Passionate team
- Stunning design
- Digital dreams
- We bring your vision to life
- Pixel-perfect experiences
- Cutting-edge everything

---

## SEO Requirements

Create metadata for:

- Title
- Description
- Open Graph title
- Open Graph description
- OG image placeholder
- Twitter/X card
- Canonical URL
- Structured data using JSON-LD for Organization and ProfessionalService

Target SEO keywords:

Primary:

- web development studio Europe
- web development Slovakia
- custom web applications Europe
- business website development
- AI-ready web development
- EU web development agency

Secondary:

- Next.js development
- Astro website development
- React web development
- custom dashboards
- client portals
- API integrations
- GDPR-ready websites
- web app development Slovakia

Do not keyword-stuff. Use natural language.

---

## Accessibility Requirements

Implement:

- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation
- Visible focus states
- ARIA only where necessary
- Correct labels for forms
- Sufficient color contrast
- Reduced-motion support
- No hover-only essential information
- Mobile menu accessible by keyboard
- Descriptive alt text
- Skip-to-content link

---

## Deliverables

Generate a complete production-ready project, including:

- File/folder structure
- Source code
- Components
- Pages
- Styles
- Content files
- SEO metadata
- Responsive layout
- Animation components
- Contact form UI and placeholder API integration
- README with setup instructions
- Deployment notes
- Environment variable examples
- Basic performance notes
- Accessibility notes

---

## Suggested File Structure

Use a clean structure similar to:

```text
src/
  components/
    layout/
    sections/
    ui/
    animations/
    forms/
  content/
    services.ts
    faq.ts
    case-studies.ts
    tech-stack.ts
  layouts/
  pages/
  styles/
  lib/
  assets/
```

Include reusable components and avoid one huge page file.

---

## Important Implementation Rules

- Do not create a bloated animation-heavy site.
- Do not use unnecessary dependencies.
- Do not use lorem ipsum in final visible copy.
- Do not fake real customer results.
- Do not make the site dark theme.
- Do not create inaccessible hover-only interactions.
- Do not use stock-photo-heavy design.
- Do not create a generic agency template.
- Do not ignore mobile performance.
- Do not hardcode secrets.
- Do not ship broken form logic.
- Do not skip SEO metadata.
- Do not skip README.

---

## Final Quality Bar

The final website should feel like a premium European engineering studio that can credibly build:

- Modern websites
- Web apps
- Dashboards
- Portals
- AI-integrated interfaces
- API-connected business systems
- Maintainable production software

The main impression should be:

> These people understand design, engineering, business systems, and long-term technical ownership.

---

## Extra Engineering Notes

Do not over-index on “2026 libraries.” The better flex is:

- Fast page
- Clean architecture
- Small JavaScript payload
- Real copy
- Useful CTA
- Measurable conversion path
- Strong EU/GDPR trust angle
- Easy path from website to web app to AI integration

Shiny animations impress developers. Engineering maturity impresses buyers.

/**
 * Shared content types for Build with EUHub.
 * Content is structured as per-locale bundle objects (src/content/en/, src/content/sk/).
 * EN is canonical; SK is a full translation.
 */

export type Locale = 'en' | 'sk';

export const locales = ['en', 'sk'] as const;
export const defaultLocale = 'en';

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface SiteContent {
  /** Wordmark shown in header/footer */
  wordmark: string;
  /** Short tagline for header */
  tagline: string;
  /** Primary nav items */
  nav: NavItem[];
  /** Ecosystem links (header, opens new tab) */
  ecosystemLinks: NavItem[];
  /** Contact email */
  contactEmail: string;
  /** Location line */
  location: string;
  /** Footer bottom-bar copyright line, after "© {year} " */
  footerRights: string;
  /** SEO defaults */
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface ProblemItem {
  /** Short title (2-4 words) */
  title: string;
  /** One-sentence muted body copy */
  body: string;
}

export interface Service {
  id: string;
  title: string;
  /** Short mono index tag rendered as "NN // Tag" (e.g. "Websites") */
  tag: string;
  /** One-sentence explanation */
  summary: string;
  /** What it includes (bullet points) */
  includes: string[];
  /** Technical icon identifier */
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  summary: string;
  deliverables: string[];
}

export interface TechCategory {
  id: string;
  title: string;
  items: string[];
  icon: string;
}

export interface ExampleScenario {
  id: string;
  sector: string;
  problem: string;
  solution: string;
  result: string;
  /** Explicitly labelled as an example, not a real client */
  isExample: boolean;
}

export interface EngagementModel {
  id: string;
  shape: string;
  howItWorks: string;
  priceOrientation: string;
  typicalScope: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface EcosystemBrand {
  id: string;
  name: string;
  role: string;
  description: string;
  /**
   * Outbound URL. Omitted for the self-referential "This site" card — per
   * the design brief it must not link out (it already is this page).
   */
  url?: string;
}

export interface LegalContent {
  title: string;
  /** Interim copy — must be reviewed by legal counsel before launch */
  body: string[];
  lastUpdated: string;
}

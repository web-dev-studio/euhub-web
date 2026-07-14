/**
 * Shared content types for Web Dev Studio by EUHUB.
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
  /** SEO defaults */
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface Service {
  id: string;
  title: string;
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
  url: string;
}

export interface LegalContent {
  title: string;
  /** Interim copy — must be reviewed by legal counsel before launch */
  body: string[];
  lastUpdated: string;
}

import type { SiteContent, NavItem, HeroStat } from '../types';

const site: SiteContent = {
  wordmark: 'Build',
  tagline: 'with EUHub',
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Examples', href: '#examples' },
    { label: 'Process', href: '#process' },
    { label: 'Tech Stack', href: '#tech' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  ecosystemLinks: [
    { label: 'Grow with EUHub', href: 'https://grow.euhub.co' },
    { label: 'EUHub AI', href: 'https://ai.euhub.co' },
    { label: 'EUHub', href: 'https://euhub.co' },
    { label: 'EUHub Community', href: 'https://community.euhub.co' },
    { label: 'Deploy with EUHub', href: 'https://deploy.euhub.co' },
  ],
  contactEmail: 'hello@euhub-ai.com',
  location: 'Slovakia · European Union',
  footerRights: 'Build with EUHub · EU-based · GDPR-aware',
  seo: {
    title: 'Build with EUHub',
    description:
      'We build fast, secure, conversion-focused web platforms, web apps, and AI-ready interfaces for European businesses. Engineering-led, GDPR-aware, maintained long-term.',
    ogImage: '/og.png',
  },
};

const primaryCta: NavItem = {
  label: 'Request an audit',
  href: '#contact',
};

const secondaryCta: NavItem = {
  label: 'View Services',
  href: '#services',
};

const tertiaryCta: NavItem = {
  label: 'Explore EUHUB AI',
  href: 'https://ai.euhub.co',
};

const trustLine =
  'Based in Slovakia · Built for EU businesses · GDPR-aware by default';

const heroStats: HeroStat[] = [
  { label: 'Lighthouse', value: '95+ / 100' },
  { label: 'JS payload', value: '< 50 KB' },
  { label: 'TTFB', value: '< 100 ms' },
  { label: 'LCP', value: '< 1.5 s' },
];

export const siteBundle = {
  site,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  trustLine,
  heroStats,
};

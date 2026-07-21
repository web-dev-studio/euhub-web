import type { SiteContent, NavItem, HeroStat } from '../types';

const site: SiteContent = {
  wordmark: 'Build',
  tagline: 'with EUHub',
  nav: [
    { label: 'Služby', href: '#services' },
    { label: 'Príklady', href: '#examples' },
    { label: 'Proces', href: '#process' },
    { label: 'Technológie', href: '#tech' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontakt', href: '#contact' },
  ],
  ecosystemLinks: [
    { label: 'Grow with EUHub', href: 'https://grow.euhub.co' },
    { label: 'EUHub AI', href: 'https://ai.euhub.co' },
    { label: 'EUHub', href: 'https://euhub.co' },
    { label: 'EUHub Community', href: 'https://community.euhub.co' },
    { label: 'Deploy with EUHub', href: 'https://deploy.euhub.co' },
  ],
  contactEmail: 'hello@euhub-ai.com',
  location: 'Slovensko · Európska únia',
  footerRights: 'Build with EUHub · Sídlo v EÚ · GDPR-aware',
  seo: {
    title: 'Build with EUHub',
    description:
      'Staviame rýchle, bezpečné, konverzné webové platformy, webové aplikácie a AI-ready rozhrania pre európske firmy. Engineering-led, GDPR-aware, dlhodobo udržiavané.',
    ogImage: '/sk/og.png',
  },
};

const primaryCta: NavItem = {
  label: 'Vyžiadať audit',
  href: '#contact',
};

const secondaryCta: NavItem = {
  label: 'Zobraziť služby',
  href: '#services',
};

const tertiaryCta: NavItem = {
  label: 'Preskúmať EUHUB AI',
  href: 'https://ai.euhub.co',
};

const trustLine =
  'Sídlo na Slovensku · Postavené pre firmy v EÚ · GDPR-aware v základe';

const heroStats: HeroStat[] = [
  { label: 'Lighthouse', value: '95+ / 100' },
  { label: 'Veľkosť JS', value: '< 50 KB' },
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

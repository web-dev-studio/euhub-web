import type { SiteContent, NavItem } from '../types';

const site: SiteContent = {
  wordmark: 'Web Dev Studio',
  tagline: 'by EUHUB',
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Examples', href: '#examples' },
    { label: 'Process', href: '#process' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  ecosystemLinks: [
    { label: 'EUHUB.CO', href: 'https://euhub.co' },
    { label: 'EUHUB AI', href: 'https://euhub-ai.com' },
  ],
  contactEmail: 'studio@euhub.co',
  location: 'Slovakia · European Union',
  seo: {
    title: 'Web Dev Studio by EUHUB',
    description:
      'We build fast, secure, conversion-focused web platforms, web apps, and AI-ready interfaces for European businesses. Engineering-led, GDPR-aware, maintained long-term.',
    ogImage: '/og.png',
  },
};

const primaryCta: NavItem = {
  label: 'Request Web Audit',
  href: '#contact',
};

const secondaryCta: NavItem = {
  label: 'View Services',
  href: '#services',
};

const tertiaryCta: NavItem = {
  label: 'Explore EUHUB AI',
  href: 'https://euhub-ai.com',
};

const trustLine =
  'Based in Slovakia. Built for EU businesses. GDPR-aware by default.';

export const siteBundle = {
  site,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  trustLine,
};

import type { Service } from '../types';

const services: Service[] = [
  {
    id: 'business-websites',
    title: 'Modern business websites',
    summary:
      'Fast, responsive, SEO-ready websites for companies that need credibility and lead generation.',
    includes: [
      'Static-first architecture',
      'Core Web Vitals optimized',
      'Structured data and sitemap',
      'Analytics and conversion tracking',
    ],
    icon: 'globe',
  },
  {
    id: 'landing-pages',
    title: 'Landing pages',
    summary:
      'Conversion-focused campaign pages for services, products, events, and audits.',
    includes: [
      'Single-goal layout',
      'A/B-test-ready structure',
      'Fast load on mobile',
      'Form or CTA integration',
    ],
    icon: 'target',
  },
  {
    id: 'web-apps',
    title: 'Custom web applications',
    summary:
      'Internal tools, dashboards, booking systems, portals, and operational interfaces.',
    includes: [
      'Role-based access',
      'Real-time data flows',
      'API-backed interfaces',
      'Audit-friendly logging',
    ],
    icon: 'app',
  },
  {
    id: 'ai-interfaces',
    title: 'AI-integrated web interfaces',
    summary:
      'Frontends for AI assistants, RAG systems, automation workflows, and internal copilots.',
    includes: [
      'Streaming responses',
      'Human-in-the-loop review',
      'Secure document handling',
      'Model routing and fallbacks',
    ],
    icon: 'sparkles',
  },
  {
    id: 'redesign',
    title: 'Website redesign and migration',
    summary:
      'Rebuild outdated websites into modern, maintainable, high-performance systems.',
    includes: [
      'Content audit and migration',
      'URL redirect mapping',
      'SEO preservation',
      'Modern stack rebuild',
    ],
    icon: 'refresh',
  },
  {
    id: 'integrations',
    title: 'API and business integrations',
    summary:
      'CRM, ERP, payment, email, analytics, logistics, and internal database integrations.',
    includes: [
      'REST and GraphQL',
      'Legacy SOAP where required',
      'Webhooks and event flows',
      'Error handling and retries',
    ],
    icon: 'plug',
  },
  {
    id: 'maintenance',
    title: 'Maintenance and DevOps',
    summary:
      'Hosting, CI/CD, monitoring, security updates, backups, and long-term care.',
    includes: [
      'CI/CD pipelines',
      'Uptime monitoring',
      'Security patching',
      'Backup and recovery',
    ],
    icon: 'wrench',
  },
];

export const servicesBundle = { services };

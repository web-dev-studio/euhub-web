import type { EcosystemBrand } from '../types';

const eyebrow = 'Ecosystem';

const ecosystem: EcosystemBrand[] = [
  {
    id: 'grow-with-euhub',
    name: 'Grow with EUHUB',
    role: 'Marketing & growth',
    description:
      'Full-funnel marketing systems — paid media, SEO, content, and automation — built by an engineering studio, with GDPR-aware tracking and real attribution.',
    url: 'https://grow.euhub.co',
  },
  {
    id: 'euhub-ai',
    name: 'EUHUB AI',
    role: 'AI implementation',
    description:
      'Agentic AI implementation, automation, workflow audits, AI systems, and custom web apps.',
    url: 'https://ai.euhub.co',
  },
  {
    id: 'euhub-co',
    name: 'EUHUB.CO',
    role: 'Corporate parent',
    description:
      'European AI and software consulting. GDPR-first, EU-resident infrastructure, custom engineering.',
    url: 'https://euhub.co',
  },
  {
    id: 'euhub-sk',
    name: 'EUHUB.SK',
    role: 'Slovak community',
    description:
      'Slovak IT community, incubator, coworking, business support, relocation, and legal/accounting support.',
    url: 'https://community.euhub.co',
  },
];

export const ecosystemBundle = { eyebrow, ecosystem };

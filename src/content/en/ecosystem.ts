import type { EcosystemBrand } from '../types';

const eyebrow = 'Ecosystem';

const ecosystem: EcosystemBrand[] = [
  {
    id: 'web-dev-studio',
    name: 'Web Dev Studio',
    role: 'This site',
    description:
      'Websites, landing pages, portals, and web applications. The web engineering and digital product studio inside EUHUB.',
    // No `url` — this card is self-referential (this site) and must not link out.
  },
  {
    id: 'euhub-ai',
    name: 'EUHUB AI',
    role: 'AI implementation',
    description:
      'Agentic AI implementation, automation, workflow audits, AI systems, and custom web apps.',
    url: 'https://euhub-ai.com',
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
    url: 'https://euhub.sk',
  },
];

export const ecosystemBundle = { eyebrow, ecosystem };

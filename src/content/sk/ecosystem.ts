import type { EcosystemBrand } from '../types';

const eyebrow = 'Ekosystém';

const ecosystem: EcosystemBrand[] = [
  {
    id: 'grow-with-euhub',
    name: 'Grow with EUHUB',
    role: 'Marketing a rast',
    description:
      'Full-funnel marketingové systémy — platená reklama, SEO, obsah a automatizácia — postavené inžinierskym štúdiom, s GDPR-aware trackingom a reálnou atribúciou.',
    url: 'https://grow.euhub.co',
  },
  {
    id: 'euhub-ai',
    name: 'EUHUB AI',
    role: 'AI implementácia',
    description:
      'Agentic AI implementácia, automatizácia, workflow audity, AI systémy a custom web appky.',
    url: 'https://ai.euhub.co',
  },
  {
    id: 'euhub-co',
    name: 'EUHUB.CO',
    role: 'Mateřská spoločnosť',
    description:
      'Európske AI a softvér consulting. GDPR-first, EU-resident infraštruktúra, custom engineering.',
    url: 'https://euhub.co',
  },
  {
    id: 'euhub-sk',
    name: 'EUHUB.SK',
    role: 'Slovenská komunita',
    description:
      'Slovenská IT komunita, inkubátor, coworking, biznis podpora, relocácia a právne/účtovné služby.',
    url: 'https://community.euhub.co',
  },
];

export const ecosystemBundle = { eyebrow, ecosystem };

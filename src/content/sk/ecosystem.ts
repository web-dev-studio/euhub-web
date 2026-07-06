import type { EcosystemBrand } from '../types';

const ecosystem: EcosystemBrand[] = [
  {
    id: 'web-dev-studio',
    name: 'Web Dev Studio',
    role: 'Tento web',
    description:
      'Weby, landing pages, portály a webové aplikácie. Web engineering a digital product studio v rámci EUHUB.',
    url: 'https://web-dev-studio.com',
  },
  {
    id: 'euhub-ai',
    name: 'EUHUB AI',
    role: 'AI implementácia',
    description:
      'Agentic AI implementácia, automatizácia, workflow audity, AI systémy a custom web appky.',
    url: 'https://euhub-ai.com',
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
    url: 'https://euhub.sk',
  },
];

export const ecosystemBundle = { ecosystem };

import type { EngagementModel } from '../types';

const engagementModels: EngagementModel[] = [
  {
    id: 'audit',
    shape: 'Technický Web Audit',
    howItWorks:
      'Fixná cena, jednotýždňová diagnostika vášho súčasného webu, výkonu, štruktúry, integrácií a technických rizík. Dostanete jasný zoznam, čo opraviť, čo prebudovať a čo sa neoplatí riešiť.',
    priceOrientation: '€500–€1,500 (jednorázovo)',
    typicalScope: '1 týždeň · audit report + prioritizovaný zoznam akcií',
  },
  {
    id: 'project',
    shape: 'Fixný projekt',
    howItWorks:
      'Definovaný build s dohodnutými deliverables, časovým harmonogramom a cenou. Landing page, firemný web, web app alebo AI rozhranie. Scope je uzamknutý pred štartom engineeringu.',
    priceOrientation: '€3,000–€25,000+ (projekt)',
    typicalScope: '2–10 týždňov · dizajn, engineering, launch',
  },
  {
    id: 'retainer',
    shape: 'Mesačný retainer',
    howItWorks:
      'Dlhodobá starostlivosť: údržba, DevOps, monitoring, bezpečnostné updaty, iterácie a nové funkcie podľa toho, ako sa váš biznis vyvíja.',
    priceOrientation: '€500–€3,000 / mesiac',
    typicalScope: 'Priebežné · hosting, monitoring, iterácie, support',
  },
];

const pricingOrientationCopy =
  'Ceny odvodzujeme od scopu, integrácií, časového harmonogramu a dlhodobej údržby. Väčšina serióznych projektov začína technickým auditom alebo discovery fázou.';

export const engagementModelsBundle = {
  engagementModels,
  pricingOrientationCopy,
};

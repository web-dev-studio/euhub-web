import type { ProcessStep } from '../types';

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Diagnostika',
    summary:
      'Preveríme váš web, ponuku, používateľov, technický stack, analytiku a úzke miesta.',
    deliverables: [
      'Technický audit report',
      'Review konverznej štruktúry',
      'Performance a SEO baseline',
      'Zoznam rizík a príležitostí',
    ],
  },
  {
    step: 2,
    title: 'Architektúra',
    summary:
      'Definujeme sitemap, štruktúru obsahu, integrácie, dátové toky a technologické voľby.',
    deliverables: [
      'Informačná architektúra',
      'Mapa integrácií',
      'Technologické rozhodnutia',
      'Model obsahu',
    ],
  },
  {
    step: 3,
    title: 'Dizajn systém',
    summary:
      'Vytvoríme vizuálny jazyk, komponenty, UI patterny a responzívnu štruktúru.',
    deliverables: [
      'Knižnica komponentov',
      'Responzívne layouty',
      'Prístupnosť v základe',
      'Brand-aligned vizuály',
    ],
  },
  {
    step: 4,
    title: 'Engineering',
    summary:
      'Staviame frontend, backend/API integrácie, CMS/obsahový model, analytiku a deployment pipeline.',
    deliverables: [
      'Produkčný codebase',
      'API integrácie',
      'Analytika a sledovanie',
      'CI/CD pipeline',
    ],
  },
  {
    step: 5,
    title: 'Launch a zlepšovanie',
    summary: 'Deployujeme, monitorujeme, meriame, iterujeme a udržiavame.',
    deliverables: [
      'Produkčný deployment',
      'Monitoring a alerty',
      'Sledovanie výkonu',
      'Backlog iterácií',
    ],
  },
];

export const processBundle = { processSteps };

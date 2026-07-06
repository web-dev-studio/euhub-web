import type { Service } from '../types';

const services: Service[] = [
  {
    id: 'business-websites',
    title: 'Moderné firemné weby',
    summary:
      'Rýchle, responzívne, SEO-pripravené weby pre firmy, ktoré potrebujú dôveryhodnosť a generovanie leadov.',
    includes: [
      'Static-first architektúra',
      'Core Web Vitals optimalizované',
      'Štruktúrované dáta a sitemap',
      'Analytika a konverzné sledovanie',
    ],
    icon: 'globe',
  },
  {
    id: 'landing-pages',
    title: 'Landing pages',
    summary:
      'Konverzné kampanové stránky pre služby, produkty, eventy a audity.',
    includes: [
      'Layout s jedným cieľom',
      'A/B-test pripravená štruktúra',
      'Rýchle načítanie na mobile',
      'Integrácia formulára alebo CTA',
    ],
    icon: 'target',
  },
  {
    id: 'web-apps',
    title: 'Custom webové aplikácie',
    summary:
      'Interné nástroje, dashboardy, rezervačné systémy, portály a operačné rozhrania.',
    includes: [
      'Role-based prístup',
      'Real-time dátové toky',
      'API-backed rozhrania',
      'Audit-friendly logovanie',
    ],
    icon: 'app',
  },
  {
    id: 'ai-interfaces',
    title: 'AI-integrované webové rozhrania',
    summary:
      'Frontendy pre AI asistentov, RAG systémy, automatizačné workflow a interné copiloty.',
    includes: [
      'Streaming odpovede',
      'Human-in-the-loop kontrola',
      'Bezpečné spracovanie dokumentov',
      'Model routing a fallbacky',
    ],
    icon: 'sparkles',
  },
  {
    id: 'redesign',
    title: 'Redesign a migrácia webu',
    summary:
      'Prebudovanie zastaraných webov na moderné, udržiavateľné, výkonné systémy.',
    includes: [
      'Audit a migrácia obsahu',
      'Mapovanie URL redirectov',
      'Zachovanie SEO',
      'Prebudovanie na modernom stacku',
    ],
    icon: 'refresh',
  },
  {
    id: 'integrations',
    title: 'API a biznis integrácie',
    summary:
      'CRM, ERP, platby, email, analytika, logistika a interné databázové integrácie.',
    includes: [
      'REST a GraphQL',
      'Legacy SOAP kde je potrebné',
      'Webhooky a event toky',
      'Error handling a retries',
    ],
    icon: 'plug',
  },
  {
    id: 'maintenance',
    title: 'Údržba a DevOps',
    summary:
      'Hosting, CI/CD, monitoring, bezpečnostné updaty, backupy a dlhodobá starostlivosť.',
    includes: [
      'CI/CD pipeliny',
      'Uptime monitoring',
      'Security patching',
      'Backup a recovery',
    ],
    icon: 'wrench',
  },
];

export const servicesBundle = { services };

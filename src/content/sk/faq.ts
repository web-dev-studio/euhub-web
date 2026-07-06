import type { FaqItem } from '../types';

const faq: FaqItem[] = [
  {
    question: 'Robíte iba weby?',
    answer:
      'Nie. Staviame weby, landing pages, custom webové aplikácie, klientské portály, interné dashboardy a AI-integrované rozhrania. Web je často vstupný bod; skutočná práca je systém za ním.',
  },
  {
    question: 'Môžete postaviť custom web app alebo dashboard?',
    answer:
      'Áno. Interné nástroje, rezervačné systémy, operačné dashboardy a klientske portály sú jadrom toho, čo robíme. Sú engineeringované pre vaše biznis workflowy, nie narazené na šablónu.',
  },
  {
    question: 'Môžete integrovať náš CRM/ERP?',
    answer:
      'Áno. Integrujeme CRM, ERP, platby, email, analytiku, logistiku a interné databázové systémy. Zvládame REST, GraphQL, webhooky a legacy SOAP API keď je potrebné.',
  },
  {
    question: 'Viete pracovať s legacy SOAP API?',
    answer:
      'Áno. Ak máte legacy systémy, ktoré exposesujú len SOAP endpointy, postavíme integračnú vrstvu, ktorá translátuje medzi SOAP a moderným REST/GraphQL. Nenútime vás vyhodiť fungujúcu infraštruktúru.',
  },
  {
    question: 'Robíte AI funkcie?',
    answer:
      'Áno. Staviame frontendy pre AI asistentov, RAG systémy, automatizačné workflow a interné copiloty. Implementujeme streaming, human-in-the-loop kontrolu, bezpečné spracovanie dokumentov a model routing s fallbackmi.',
  },
  {
    question: 'Môžete hostovať a udržiavať web?',
    answer:
      'Áno. Ponúkame mesačné retainery pokrývajúce hosting, CI/CD, monitoring, bezpečnostné updaty, backupy a iterácie. Dlhodobé technické vlastníctvo je súčasťou ponuky, nie dodatočná myšlienka.',
  },
  {
    question: 'Ste GDPR-aware?',
    answer:
      'Áno. Staviame s GDPR-aware architektúrou, EU data residency opciami, bezpečnými formulármi, role-based prístupom a audit-friendly logovaním pre biznis aplikácie. Analytika je cookieless v základe.',
  },
  {
    question: 'Pracujete s firmami mimo Slovenska?',
    answer:
      'Áno. Sídlime na Slovensku a pracujeme s firmami po celej EÚ. Lokácia vám dáva EU data residency a GDPR alignment bez extra námahy.',
  },
  {
    question: 'Ako dlho trvá projekt webu?',
    answer:
      'Landing page trvá 1–3 týždne. Firemný web 3–8 týždňov. Custom webová aplikácia 6–16 týždňov v závislosti od scopu, integrácií a zložitosti. Časový harmonogram definujeme počas architektúry.',
  },
  {
    question: 'Čo potrebujete od nás na štart?',
    answer:
      'Technický web audit je bežný štartovací bod. Potrebujeme prístup k vášmu súčasnému webu, analytike (ak nejakú máte) a krátky call o vašich biznis cieľoch. Zvyšok zvládneme my.',
  },
  {
    question: 'Ako oceňujete projekty?',
    answer:
      'Ceny odvodzujeme od scopu, integrácií, časového harmonogramu a dlhodobej údržby. Väčšina projektov začína fixným technickým auditom (€500–€1,500), potom prechádza na fixný projekt alebo mesačný retainer.',
  },
  {
    question: 'Ponúkate priebežnú podporu po launche?',
    answer:
      'Áno. Retainery údržby a DevOps pokrývajú monitoring, security patching, backupy, sledovanie výkonu a nové funkcie podľa toho, ako sa váš biznis vyvíja. Web, ktorý nikto neudržiava, sa stáva záťažou.',
  },
];

export const faqBundle = { faq };

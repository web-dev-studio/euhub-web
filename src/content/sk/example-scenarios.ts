import type { ExampleScenario } from '../types';

const eyebrow = 'Príklady';

const exampleScenarios: ExampleScenario[] = [
  {
    id: 'logistics',
    sector: 'Logistická firma',
    problem:
      'Zastaraný web s manuálnymi požiadavkami na cenovú ponuku. Žiadna CRM integrácia. Leady sa strácali v emailoch.',
    solution:
      'Moderný landing page, štruktúrovaný formulár cenovej ponuky, CRM integrácia a interný dashboard na sledovanie požiadaviek.',
    result:
      'Rýchlejšie spracovanie leadov, čistejšie operácie a jeden zdroj pravdy pre sales tím.',
    isExample: true,
  },
  {
    id: 'medical-services',
    sector: 'Medicínske / logistické služby',
    problem:
      'Fragmentovaná interná komunikácia medzi tímami. Dokumenty spracovávané manuálne bez audit trailu.',
    solution:
      'Bezpečný portál s role-based dashboardmi, AI-asistovaným spracovaním dokumentov a human-in-the-loop kontrolou.',
    result:
      'Menej manuálnej koordinácie, jasnejšia zodpovednosť a defenzibilný audit trail.',
    isExample: true,
  },
  {
    id: 'b2b-services',
    sector: 'B2B služby',
    problem:
      'Nízka dôvera a slabá konverzia. Žiadna analytika. Žiadna jasná cesta od návštevníka k kvalifikovanému leadu.',
    solution:
      'Premium web so SEO štruktúrou, analytikou, lead funnel a kvalifikačným kontaktným formulárom.',
    result:
      'Lepšie kvalifikované inbound požiadavky a merateľná cesta od trafficu do pipeline.',
    isExample: true,
  },
];

export const exampleScenariosBundle = { eyebrow, exampleScenarios };

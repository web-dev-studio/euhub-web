import type { ExampleScenario } from '../types';

const eyebrow = 'Examples';

const exampleScenarios: ExampleScenario[] = [
  {
    id: 'logistics',
    sector: 'Logistics company',
    problem:
      'Outdated website with manual quote requests. No CRM integration. Leads lost in email threads.',
    solution:
      'Modern landing page, structured quote form, CRM integration, and an internal dashboard for tracking requests.',
    result:
      'Faster lead handling, cleaner operations, and a single source of truth for the sales team.',
    isExample: true,
  },
  {
    id: 'medical-services',
    sector: 'Medical / logistics service',
    problem:
      'Fragmented internal communication across teams. Documents handled manually with no audit trail.',
    solution:
      'Secure portal with role-based dashboards, AI-assisted document handling, and human-in-the-loop review.',
    result:
      'Reduced manual coordination, clearer accountability, and a defensible audit trail.',
    isExample: true,
  },
  {
    id: 'b2b-services',
    sector: 'B2B services company',
    problem:
      'Low trust and weak conversion. No analytics discipline. No clear path from visitor to qualified lead.',
    solution:
      'Premium website with SEO structure, analytics, lead funnel, and a qualifying contact form.',
    result:
      'Better-qualified inbound requests and a measurable path from traffic to pipeline.',
    isExample: true,
  },
];

export const exampleScenariosBundle = { eyebrow, exampleScenarios };

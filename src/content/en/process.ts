import type { ProcessStep } from '../types';

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Diagnostic',
    summary:
      'We review your website, offer, users, technical stack, analytics, and bottlenecks.',
    deliverables: [
      'Technical audit report',
      'Conversion structure review',
      'Performance and SEO baseline',
      'Risk and opportunity list',
    ],
  },
  {
    step: 2,
    title: 'Architecture',
    summary:
      'We define sitemap, content structure, integrations, data flows, and technology choices.',
    deliverables: [
      'Information architecture',
      'Integration map',
      'Technology decisions',
      'Content model',
    ],
  },
  {
    step: 3,
    title: 'Design system',
    summary:
      'We create the visual language, components, UI patterns, and responsive structure.',
    deliverables: [
      'Component library',
      'Responsive layouts',
      'Accessibility foundations',
      'Brand-aligned visuals',
    ],
  },
  {
    step: 4,
    title: 'Engineering',
    summary:
      'We build the frontend, backend/API integrations, CMS/content model, analytics, and deployment pipeline.',
    deliverables: [
      'Production codebase',
      'API integrations',
      'Analytics and tracking',
      'CI/CD pipeline',
    ],
  },
  {
    step: 5,
    title: 'Launch and improve',
    summary: 'We deploy, monitor, measure, iterate, and maintain.',
    deliverables: [
      'Production deployment',
      'Monitoring and alerts',
      'Performance tracking',
      'Iteration backlog',
    ],
  },
];

export const processBundle = { processSteps };

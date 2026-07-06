import type { TechCategory } from '../types';

const techStack: TechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'layout',
    items: [
      'Astro',
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Motion',
    ],
  },
  {
    id: 'backend',
    title: 'Backend / API',
    icon: 'server',
    items: [
      'Node.js',
      'Rust (kde záleží na výkone)',
      'REST API',
      'GraphQL',
      'SOAP (legacy integrácie)',
      'PostgreSQL',
      'Redis',
      'Webhooky',
    ],
  },
  {
    id: 'ai',
    title: 'AI-ready systémy',
    icon: 'sparkles',
    items: [
      'RAG rozhrania',
      'AI asistent UI',
      'Workflow automatizácia',
      'Bezpečné spracovanie dokumentov',
      'Human-in-the-loop kontrola',
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: 'cloud',
    items: [
      'Docker',
      'CI/CD',
      'GitHub Actions',
      'Cloudflare',
      'GCP EU regióny',
      'Monitoring',
      'Logovanie',
      'Backupy',
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance / bezpečnosť',
    icon: 'shield',
    items: [
      'GDPR-aware architektúra',
      'EU data residency opcie',
      'Bezpečné formuláre',
      'Role-based prístup',
      'Audit-friendly logovanie',
    ],
  },
];

export const techStackBundle = { techStack };

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
      'Rust (where performance matters)',
      'REST APIs',
      'GraphQL',
      'SOAP (legacy integrations)',
      'PostgreSQL',
      'Redis',
      'Webhooks',
    ],
  },
  {
    id: 'ai',
    title: 'AI-ready systems',
    icon: 'sparkles',
    items: [
      'RAG interfaces',
      'AI assistant UIs',
      'Workflow automation',
      'Secure document processing',
      'Human-in-the-loop review',
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
      'GCP EU regions',
      'Monitoring',
      'Logging',
      'Backups',
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance / security',
    icon: 'shield',
    items: [
      'GDPR-aware architecture',
      'EU data residency options',
      'Secure forms',
      'Role-based access',
      'Audit-friendly logging',
    ],
  },
];

export const techStackBundle = { techStack };

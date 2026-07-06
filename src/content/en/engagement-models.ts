import type { EngagementModel } from '../types';

const engagementModels: EngagementModel[] = [
  {
    id: 'audit',
    shape: 'Technical Web Audit',
    howItWorks:
      'A fixed-price, one-week diagnostic of your current website, performance, structure, integrations, and technical risks. You get a clear list of what to fix, what to rebuild, and what is not worth touching.',
    priceOrientation: '€500–€1,500 (one-time)',
    typicalScope: '1 week · audit report + prioritized action list',
  },
  {
    id: 'project',
    shape: 'Fixed-scope project',
    howItWorks:
      'A defined build with agreed deliverables, timeline, and price. Landing page, business website, web app, or AI interface. Scope is locked before engineering starts.',
    priceOrientation: '€3,000–€25,000+ (project)',
    typicalScope: '2–10 weeks · design, engineering, launch',
  },
  {
    id: 'retainer',
    shape: 'Monthly retainer',
    howItWorks:
      'Long-term care: maintenance, DevOps, monitoring, security updates, iterations, and new features as your business evolves.',
    priceOrientation: '€500–€3,000 / month',
    typicalScope: 'Ongoing · hosting, monitoring, iterations, support',
  },
];

const pricingOrientationCopy =
  'We price based on scope, integrations, timeline, and long-term maintenance requirements. Most serious projects start with a technical audit or discovery phase.';

export const engagementModelsBundle = {
  engagementModels,
  pricingOrientationCopy,
};

import type { Locale } from '../content/types';
import { siteBundle as enSite } from '../content/en/site';
import { servicesBundle as enServices } from '../content/en/services';
import { processBundle as enProcess } from '../content/en/process';
import { techStackBundle as enTechStack } from '../content/en/tech-stack';
import { exampleScenariosBundle as enExamples } from '../content/en/example-scenarios';
import { engagementModelsBundle as enEngagement } from '../content/en/engagement-models';
import { faqBundle as enFaq } from '../content/en/faq';
import { ecosystemBundle as enEcosystem } from '../content/en/ecosystem';
import { legalBundle as enLegal } from '../content/en/legal';
import { siteBundle as skSite } from '../content/sk/site';
import { servicesBundle as skServices } from '../content/sk/services';
import { processBundle as skProcess } from '../content/sk/process';
import { techStackBundle as skTechStack } from '../content/sk/tech-stack';
import { exampleScenariosBundle as skExamples } from '../content/sk/example-scenarios';
import { engagementModelsBundle as skEngagement } from '../content/sk/engagement-models';
import { faqBundle as skFaq } from '../content/sk/faq';
import { ecosystemBundle as skEcosystem } from '../content/sk/ecosystem';
import { legalBundle as skLegal } from '../content/sk/legal';

const enBundle = {
  site: enSite,
  services: enServices,
  process: enProcess,
  techStack: enTechStack,
  examples: enExamples,
  engagement: enEngagement,
  faq: enFaq,
  ecosystem: enEcosystem,
  legal: enLegal,
};

const skBundle = {
  site: skSite,
  services: skServices,
  process: skProcess,
  techStack: skTechStack,
  examples: skExamples,
  engagement: skEngagement,
  faq: skFaq,
  ecosystem: skEcosystem,
  legal: skLegal,
};

export type ContentBundle = typeof enBundle;

export function getContent(locale: Locale): ContentBundle {
  return locale === 'sk' ? skBundle : enBundle;
}

export function getAlternatePath(url: URL, targetLocale: Locale): string {
  const path = url.pathname;
  if (targetLocale === 'sk') {
    return '/sk' + path;
  }
  const stripped = path.replace(/^\/sk/, '');
  return stripped === '' ? '/' : stripped;
}

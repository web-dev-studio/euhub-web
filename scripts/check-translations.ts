/**
 * Translation completeness checker.
 * Runs only when src/content/sk/** files change (gated by dorny/paths-filter in CI).
 * Fails if any SK key is missing or empty compared to EN.
 */
import { siteBundle as enSite } from '../src/content/en/site';
import { servicesBundle as enServices } from '../src/content/en/services';
import { processBundle as enProcess } from '../src/content/en/process';
import { techStackBundle as enTechStack } from '../src/content/en/tech-stack';
import { exampleScenariosBundle as enExamples } from '../src/content/en/example-scenarios';
import { engagementModelsBundle as enEngagement } from '../src/content/en/engagement-models';
import { faqBundle as enFaq } from '../src/content/en/faq';
import { ecosystemBundle as enEcosystem } from '../src/content/en/ecosystem';
import { legalBundle as enLegal } from '../src/content/en/legal';
import { siteBundle as skSite } from '../src/content/sk/site';
import { servicesBundle as skServices } from '../src/content/sk/services';
import { processBundle as skProcess } from '../src/content/sk/process';
import { techStackBundle as skTechStack } from '../src/content/sk/tech-stack';
import { exampleScenariosBundle as skExamples } from '../src/content/sk/example-scenarios';
import { engagementModelsBundle as skEngagement } from '../src/content/sk/engagement-models';
import { faqBundle as skFaq } from '../src/content/sk/faq';
import { ecosystemBundle as skEcosystem } from '../src/content/sk/ecosystem';
import { legalBundle as skLegal } from '../src/content/sk/legal';

const enBundles = [
  ['site', enSite],
  ['services', enServices],
  ['process', enProcess],
  ['techStack', enTechStack],
  ['examples', enExamples],
  ['engagement', enEngagement],
  ['faq', enFaq],
  ['ecosystem', enEcosystem],
  ['legal', enLegal],
] as const;

const skBundles = [
  ['site', skSite],
  ['services', skServices],
  ['process', skProcess],
  ['techStack', skTechStack],
  ['examples', skExamples],
  ['engagement', skEngagement],
  ['faq', skFaq],
  ['ecosystem', skEcosystem],
  ['legal', skLegal],
] as const;

const errors: string[] = [];

function checkString(path: string, enVal: unknown, skVal: unknown) {
  if (typeof enVal === 'string') {
    if (typeof skVal !== 'string' || skVal.trim() === '') {
      errors.push(`[i18n] Missing SK translation for: ${path}`);
    }
    return;
  }
  if (Array.isArray(enVal)) {
    if (!Array.isArray(skVal) || skVal.length !== enVal.length) {
      errors.push(`[i18n] SK array length mismatch for: ${path}`);
      return;
    }
    enVal.forEach((item, i) => checkString(`${path}[${i}]`, item, skVal[i]));
    return;
  }
  if (typeof enVal === 'object' && enVal !== null) {
    if (typeof skVal !== 'object' || skVal === null) {
      errors.push(`[i18n] Missing SK object for: ${path}`);
      return;
    }
    for (const key of Object.keys(enVal)) {
      checkString(
        `${path}.${key}`,
        (enVal as Record<string, unknown>)[key],
        (skVal as Record<string, unknown>)[key],
      );
    }
  }
}

for (let i = 0; i < enBundles.length; i++) {
  const [name, enBundle] = enBundles[i];
  const [, skBundle] = skBundles[i];
  for (const key of Object.keys(enBundle)) {
    checkString(
      `${name}.${key}`,
      (enBundle as Record<string, unknown>)[key],
      (skBundle as Record<string, unknown>)[key],
    );
  }
}

if (errors.length > 0) {
  console.error('\nTranslation completeness check FAILED:\n');
  for (const err of errors) {
    console.error(`  ${err}`);
  }
  console.error(`\n${errors.length} missing translation(s).`);
  process.exit(1);
} else {
  console.log(
    'Translation completeness check passed — all SK translations present.',
  );
}

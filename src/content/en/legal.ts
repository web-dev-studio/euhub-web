import type { LegalContent } from '../types';

/**
 * Legal content — INTERIM copy.
 * Must be reviewed by legal counsel against the actual deployment before launch.
 */

const lastUpdated = '2026-07-06';

const privacyPolicy: LegalContent = {
  title: 'Privacy Policy',
  lastUpdated,
  body: [
    'Web Dev Studio by EUHUB ("we", "us") operates build.euhub.co. This policy explains how we handle personal data when you use this website or submit a request through our contact form.',
    'Data we collect: When you submit the "Request Web Audit" form, we collect the information you provide — name, email, company, project details, and any optional fields you fill in. We do not collect more data than is necessary to respond to your request.',
    'Analytics: We use Umami Analytics, a cookieless analytics platform hosted in the EU (Frankfurt region). Umami does not set cookies and does not track individuals across sites. We collect aggregate metrics — page views, referrers, and event counts — to understand how the site is used. No consent banner is required because no non-essential cookies are set.',
    'Third-party processors: When you submit a form, your data is transmitted to Google Cloud Platform (our hosting provider) and to a webhook destination that routes the submission to our internal systems. Analytics data is processed by Umami Cloud (EU/Frankfurt). Each processor operates under GDPR-compatible terms.',
    'Legal basis: We process form submissions under Article 6(1)(b) GDPR (necessary to take steps at your request prior to a contract). We process analytics data under Article 6(1)(f) GDPR (legitimate interest in understanding site usage).',
    'Retention: Form submissions are retained for up to 12 months if no project results, and for the duration of any client relationship plus 3 years if a project results. Analytics data is retained in aggregate form with no individual identification.',
    'Your rights: You have the right to access, rectify, erase, restrict, or object to the processing of your personal data. You also have the right to data portability and the right to lodge a complaint with a supervisory authority. To exercise any right, contact us at hello@euhub-ai.com.',
    'Contact: For privacy questions, write to hello@euhub-ai.com. We are based in Slovakia, European Union.',
  ],
};

const cookiePolicy: LegalContent = {
  title: 'Cookie Policy',
  lastUpdated,
  body: [
    'This website does not set non-essential cookies. No consent banner is shown because no tracking cookies are used.',
    'Analytics: We use Umami Analytics, a cookieless analytics platform. Umami measures aggregate traffic without setting cookies and without identifying individual visitors. No consent is required under the ePrivacy Directive / PECR for cookieless analytics.',
    'Essential cookies: This website may set strictly necessary cookies for security or functionality if interactive features are added in the future. Any such cookies will be documented here.',
    'Third-party services: Cloudflare Turnstile is used for spam protection on the contact form. Turnstile may set a technical cookie (cf_clearance) as part of its bot-detection process. This is a security measure, not tracking.',
    'Changes: If this changes — for example, if we add a tool that sets non-essential cookies — we will update this policy and add a consent mechanism before deploying that tool.',
  ],
};

const terms: LegalContent = {
  title: 'Terms of Service',
  lastUpdated,
  body: [
    'These terms govern your use of build.euhub.co, operated by Web Dev Studio by EUHUB ("we", "us").',
    'Purpose of this website: This website is a marketing and lead-generation page. Submitting the contact form constitutes a request for information about our services. It does not constitute a contract, offer, or commitment to deliver any service.',
    'Form submissions: When you submit the "Request Web Audit" form, you agree that we may contact you about your request. You are responsible for the accuracy of the information you provide. Do not submit confidential or sensitive information in the form.',
    'Intellectual property: The content, design, and code of this website are owned by us. You may not copy, reproduce, or redistribute the site without permission.',
    'No warranty: This website is provided "as is" without warranty of any kind. We do not guarantee that the site will be error-free, uninterrupted, or fit for any particular purpose.',
    'Liability: To the extent permitted by law, our liability for any loss arising from your use of this website is limited to the amount you paid us to use it, which is zero.',
    'Governing law: These terms are governed by the laws of the Slovak Republic. Disputes will be resolved in the courts of Slovakia, unless you are a consumer entitled to bring proceedings in your country of residence.',
    'Contact: For questions about these terms, write to hello@euhub-ai.com.',
  ],
};

export const legalBundle = { privacyPolicy, cookiePolicy, terms };

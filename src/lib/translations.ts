import type { Locale } from '../content/types';

export interface FormTranslations {
  // Required field labels
  nameLabel: string;
  emailLabel: string;
  projectTypeLabel: string;
  messageLabel: string;
  // Optional field labels
  companyLabel: string;
  websiteLabel: string;
  budgetLabel: string;
  timelineLabel: string;
  decisionRoleLabel: string;
  companySizeLabel: string;
  mainProblemLabel: string;
  // Placeholders
  websitePlaceholder: string;
  messagePlaceholder: string;
  companySizePlaceholder: string;
  // Select defaults
  selectProjectType: string;
  selectPlaceholder: string;
  // Optional section header
  optionalHeader: string;
  // Honeypot
  honeypotLabel: string;
  // Button
  submitButton: string;
  submittingButton: string;
  // Success state
  successTitle: string;
  successMessage: string;
  // Error state
  errorMessage: string;
  networkError: string;
  errorFallback: string;
  // Privacy notice
  privacyNotice: string;
  privacyLink: string;
}

const en: FormTranslations = {
  nameLabel: 'Name',
  emailLabel: 'Work email',
  projectTypeLabel: 'Project type',
  messageLabel: 'What do you need?',
  companyLabel: 'Company',
  websiteLabel: 'Current website',
  budgetLabel: 'Budget range',
  timelineLabel: 'Timeline',
  decisionRoleLabel: 'Your role',
  companySizeLabel: 'Company size',
  mainProblemLabel: "Main problem you're trying to solve",
  websitePlaceholder: 'https://',
  messagePlaceholder:
    "Tell us about your project, current situation, and what you're trying to achieve.",
  companySizePlaceholder: 'e.g. 10–50 employees',
  selectProjectType: 'Select a project type',
  selectPlaceholder: 'Select…',
  optionalHeader: 'Optional — helps us prepare for your audit',
  honeypotLabel: 'Website URL (leave empty)',
  submitButton: 'Request Web Audit',
  submittingButton: 'Sending…',
  successTitle: 'Request received',
  successMessage:
    "We'll review your submission and get back to you within 1 business day.",
  errorMessage: 'Something went wrong. Please try again or email us directly.',
  networkError: 'Network error. Please try again or email us directly.',
  errorFallback: 'You can also email us directly:',
  privacyNotice:
    'By submitting this form, you agree that we may process your data to respond to your request. We use cookieless analytics and do not sell your data. See our',
  privacyLink: 'Privacy Policy',
};

const sk: FormTranslations = {
  nameLabel: 'Meno',
  emailLabel: 'Pracovný email',
  projectTypeLabel: 'Typ projektu',
  messageLabel: 'Čo potrebujete?',
  companyLabel: 'Firma',
  websiteLabel: 'Súčasný web',
  budgetLabel: 'Rozpočet',
  timelineLabel: 'Časový harmonogram',
  decisionRoleLabel: 'Vaša rola',
  companySizeLabel: 'Veľkosť firmy',
  mainProblemLabel: 'Hlavný problém, ktorý riešite',
  websitePlaceholder: 'https://',
  messagePlaceholder:
    'Povedzte nám o svojom projekte, súčasnej situácii a čo sa snažíte dosiahnuť.',
  companySizePlaceholder: 'napr. 10–50 zamestnancov',
  selectProjectType: 'Vyberte typ projektu',
  selectPlaceholder: 'Vyberte…',
  optionalHeader: 'Voliteľné — pomôže nám pripraviť sa na váš audit',
  honeypotLabel: 'URL webu (nechajte prázdne)',
  submitButton: 'Vyžiadať web audit',
  submittingButton: 'Odosielanie…',
  successTitle: 'Požiadavka prijatá',
  successMessage:
    'Preveríme vašu submission a ozveme sa vám do 1 pracovného dňa.',
  errorMessage: 'Niečo sa pokazilo. Skúste to znova alebo nám napíšte email.',
  networkError: 'Chyba siete. Skúste to znova alebo nám napíšte email.',
  errorFallback: 'Môžete nám napísať aj priamo:',
  privacyNotice:
    'Odoslaním tohto formulára súhlasíte, že môžeme spracovávať vaše dáta na odpoveď na vašu požiadavku. Používame cookieless analytiku a nepredávame vaše dáta. Pozrite našu',
  privacyLink: 'Ochranu osobných údajov',
};

export const formTranslations: Record<Locale, FormTranslations> = { en, sk };

export function getFormTranslations(locale: Locale): FormTranslations {
  return formTranslations[locale];
}

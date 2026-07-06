import { z } from 'zod';
import type { Locale } from '../content/types';

/**
 * Shared validation schema for the audit-request form.
 * Enum values are stable IDs; display labels are localized.
 * The webhook receives IDs only (no backwards-compat hedge — no consumer exists).
 */

export const projectTypes = [
  {
    id: 'audit',
    label: { en: 'Technical Web Audit', sk: 'Technický web audit' },
  },
  { id: 'landing-page', label: { en: 'Landing Page', sk: 'Landing Page' } },
  {
    id: 'business-website',
    label: { en: 'Business Website', sk: 'Firemný web' },
  },
  {
    id: 'website-redesign',
    label: { en: 'Website Redesign', sk: 'Redesign webu' },
  },
  {
    id: 'custom-web-app',
    label: { en: 'Custom Web Application', sk: 'Custom webová aplikácia' },
  },
  {
    id: 'client-portal',
    label: { en: 'Client Portal', sk: 'Klientsky portál' },
  },
  {
    id: 'internal-dashboard',
    label: { en: 'Internal Dashboard', sk: 'Interný dashboard' },
  },
  {
    id: 'ai-interface',
    label: {
      en: 'AI-integrated Web Interface',
      sk: 'AI-integrované webové rozhranie',
    },
  },
  {
    id: 'api-integration',
    label: { en: 'API/CRM/ERP Integration', sk: 'API/CRM/ERP integrácia' },
  },
  {
    id: 'maintenance-devops',
    label: { en: 'Maintenance/DevOps', sk: 'Údržba/DevOps' },
  },
  { id: 'not-sure', label: { en: 'Not sure yet', sk: 'Ešce neviem' } },
] as const;

export const budgetRanges = [
  { id: 'under-2500', label: { en: '< €2,500', sk: '< €2,500' } },
  { id: '2500-5000', label: { en: '€2,500–€5,000', sk: '€2,500–€5,000' } },
  { id: '5000-10000', label: { en: '€5,000–€10,000', sk: '€5,000–€10,000' } },
  {
    id: '10000-25000',
    label: { en: '€10,000–€25,000', sk: '€10,000–€25,000' },
  },
  { id: 'over-25000', label: { en: '€25,000+', sk: '€25,000+' } },
  { id: 'not-sure-budget', label: { en: 'Not sure yet', sk: 'Ešce neviem' } },
] as const;

export const timelines = [
  { id: 'asap', label: { en: 'ASAP', sk: 'ASAP' } },
  { id: 'within-1-month', label: { en: 'Within 1 month', sk: 'Do 1 mesiaca' } },
  { id: '1-3-months', label: { en: '1–3 months', sk: '1–3 mesiace' } },
  { id: '3-6-months', label: { en: '3–6 months', sk: '3–6 mesiacov' } },
  {
    id: 'just-researching',
    label: { en: 'Just researching', sk: 'Iba prieskum' },
  },
] as const;

export const decisionRoles = [
  { id: 'owner-founder', label: { en: 'Owner/Founder', sk: 'Owner/Founder' } },
  {
    id: 'technical',
    label: { en: 'Technical decision-maker', sk: 'Technický rozhodca' },
  },
  {
    id: 'marketing',
    label: { en: 'Marketing/Growth', sk: 'Marketing/Growth' },
  },
  { id: 'operations', label: { en: 'Operations', sk: 'Operácie' } },
  {
    id: 'project-manager',
    label: { en: 'Project manager', sk: 'Project manager' },
  },
  { id: 'other', label: { en: 'Other', sk: 'Iné' } },
] as const;

export const projectTypeIds = [
  'audit',
  'landing-page',
  'business-website',
  'website-redesign',
  'custom-web-app',
  'client-portal',
  'internal-dashboard',
  'ai-interface',
  'api-integration',
  'maintenance-devops',
  'not-sure',
] as const;

export const budgetRangeIds = [
  'under-2500',
  '2500-5000',
  '5000-10000',
  '10000-25000',
  'over-25000',
  'not-sure-budget',
] as const;

export const timelineIds = [
  'asap',
  'within-1-month',
  '1-3-months',
  '3-6-months',
  'just-researching',
] as const;

export const decisionRoleIds = [
  'owner-founder',
  'technical',
  'marketing',
  'operations',
  'project-manager',
  'other',
] as const;

export const auditRequestSchema = z.object({
  // Required (4)
  name: z.string().min(2, 'name_min').max(100, 'name_max'),
  email: z.email('email_invalid').min(1, 'email_required').max(200),
  projectType: z.enum(projectTypeIds, { message: 'project_type_required' }),
  message: z.string().min(10, 'message_min').max(2000, 'message_max'),

  // Optional (7)
  company: z.string().max(100).optional().or(z.literal('')),
  website: z.url('website_invalid').optional().or(z.literal('')),
  companySize: z.string().max(50).optional().or(z.literal('')),
  mainProblem: z.string().max(500).optional().or(z.literal('')),
  budget: z.enum(budgetRangeIds).optional().or(z.literal('')),
  timeline: z.enum(timelineIds).optional().or(z.literal('')),
  decisionRole: z.enum(decisionRoleIds).optional().or(z.literal('')),

  // Honeypot
  companyUrl: z.string().max(0).optional().or(z.literal('')),

  // Turnstile token
  turnstileToken: z.string().optional(),

  // Locale (for server-side error message selection)
  locale: z.enum(['en', 'sk']).optional(),
});

export type AuditRequestInput = z.infer<typeof auditRequestSchema>;

export const requiredFields = [
  'name',
  'email',
  'projectType',
  'message',
] as const;

export function isRequired(field: string): boolean {
  return requiredFields.includes(field as (typeof requiredFields)[number]);
}

/** Get localized label for an enum by ID */
export function getProjectTypeLabel(id: string, locale: Locale): string {
  return projectTypes.find((p) => p.id === id)?.label[locale] ?? id;
}

export function getBudgetLabel(id: string, locale: Locale): string {
  return budgetRanges.find((b) => b.id === id)?.label[locale] ?? id;
}

export function getTimelineLabel(id: string, locale: Locale): string {
  return timelines.find((t) => t.id === id)?.label[locale] ?? id;
}

export function getDecisionRoleLabel(id: string, locale: Locale): string {
  return decisionRoles.find((r) => r.id === id)?.label[locale] ?? id;
}

/** Localized validation error messages */
export const validationMessages = {
  en: {
    name_min: 'Name is required (at least 2 characters).',
    name_max: 'Name is too long (max 100 characters).',
    email_required: 'Work email is required.',
    email_invalid: 'Please enter a valid email address.',
    project_type_required: 'Please select a project type.',
    message_min: 'Please tell us a bit more (at least 10 characters).',
    message_max: 'Message is too long (max 2000 characters).',
    website_invalid: 'Please enter a valid URL.',
  },
  sk: {
    name_min: 'Meno je povinné (aspoň 2 znaky).',
    name_max: 'Meno je príliš dlhé (max 100 znakov).',
    email_required: 'Pracovný email je povinný.',
    email_invalid: 'Zadajte platný email.',
    project_type_required: 'Vyberte typ projektu.',
    message_min: 'Povedzte nám viac (aspoň 10 znakov).',
    message_max: 'Správa je príliš dlhá (max 2000 znakov).',
    website_invalid: 'Zadajte platnú URL.',
  },
} as const;

export function getValidationMessage(code: string, locale: Locale): string {
  return (
    validationMessages[locale][
      code as keyof (typeof validationMessages)['en']
    ] ?? code
  );
}

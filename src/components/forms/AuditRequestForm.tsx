import { useState, useRef, useEffect } from 'react';
import {
  auditRequestSchema,
  projectTypes,
  budgetRanges,
  timelines,
  decisionRoles,
  requiredFields,
  getValidationMessage,
  type AuditRequestInput,
} from '../../lib/validation';
import { getFormTranslations } from '../../lib/translations';
import type { Locale } from '../../content/types';

interface Props {
  turnstileSiteKey?: string;
  contactEmail: string;
  locale?: Locale;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FieldError {
  [key: string]: string | undefined;
}

/**
 * AuditRequestForm — React island for the "Request Web Audit" form.
 *
 * Per plan v3:
 *  - 4 required + 7 optional fields
 *  - Honeypot (companyUrl)
 *  - Cloudflare Turnstile (client widget)
 *  - Shared Zod validation (client + server)
 *  - Submit to /api/audit-request
 *  - Success / error / submitting states
 *  - mailto: fallback in error state
 *  - Umami tracking (form_start, submit_success, submit_error)
 */
export default function AuditRequestForm({
  turnstileSiteKey,
  contactEmail,
  locale = 'en',
}: Props) {
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FieldError>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const t = getFormTranslations(locale);

  // Load Turnstile script if site key is provided
  useEffect(() => {
    if (!turnstileSiteKey) return;
    const existing = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
    );
    if (existing) return;
    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  // Render Turnstile widget when script + container are ready
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    const tryRender = () => {
      const ts = (
        window as unknown as {
          turnstile?: {
            render: (el: HTMLElement, opts: Record<string, unknown>) => string;
          };
        }
      ).turnstile;
      if (ts && turnstileRef.current) {
        ts.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => setTurnstileToken(token),
          'error-callback': () => setTurnstileToken(''),
          theme: 'light',
          language: locale,
        });
      } else {
        setTimeout(tryRender, 200);
      }
    };
    tryRender();
  }, [turnstileSiteKey]);

  const trackFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      const umami = (
        window as unknown as { umami?: { track: (n: string) => void } }
      ).umami;
      umami?.track('audit_form_start');
    }
  };

  const handleSubmit = async (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as AuditRequestInput & {
      companyUrl?: string;
    };

    // Honeypot check (client-side; server also checks)
    if (data.companyUrl) {
      // Silently succeed without submitting (bot caught)
      setState('success');
      return;
    }

    data.turnstileToken = turnstileToken;

    // Validate with shared Zod schema
    const result = auditRequestSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FieldError = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = getValidationMessage(issue.message, locale);
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setState('submitting');

    try {
      const response = await fetch('/api/audit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (response.ok) {
        setState('success');
        const umami = (
          window as unknown as { umami?: { track: (n: string) => void } }
        ).umami;
        umami?.track('audit_form_submit_success');
        formRef.current?.reset();
        setTurnstileToken('');
      } else {
        const body = await response.json().catch(() => ({}));
        setState('error');
        setErrorMessage(body.message ?? t.errorMessage);
        const umami = (
          window as unknown as { umami?: { track: (n: string) => void } }
        ).umami;
        umami?.track('audit_form_submit_error');
      }
    } catch {
      setState('error');
      setErrorMessage(t.networkError);
      const umami = (
        window as unknown as { umami?: { track: (n: string) => void } }
      ).umami;
      umami?.track('audit_form_submit_error');
    }
  };

  // Success state
  if (state === 'success') {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-status-success-bg text-status-success ring-4 ring-status-success/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-bold text-(--color-text-primary)">
          {t.successTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
          {t.successMessage}
        </p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-surface-raised px-4 py-3 text-sm text-(--color-text-primary) placeholder:text-(--color-text-secondary) transition-all duration-200 ${
      errors[field]
        ? 'border-status-danger focus:border-status-danger focus:ring-3 focus:ring-status-danger/10'
        : 'border-(--color-border-subtle) hover:border-(--color-border-default) focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10'
    }`;
  const labelClass =
    'mb-1.5 block text-sm font-medium text-(--color-text-secondary)';
  const errorClass =
    'mt-1.5 flex items-center gap-1 text-xs text-status-danger';
  const requiredMark = <span className="text-status-danger">*</span>;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
    >
      {/* Honeypot — hidden from users, visible to bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="companyUrl">{t.honeypotLabel}</label>
        <input
          id="companyUrl"
          name="companyUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Required fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t.nameLabel} {requiredMark}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={inputClass('name')}
            onFocus={trackFormStart}
            required={requiredFields.includes('name' as never)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className={errorClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t.emailLabel} {requiredMark}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass('email')}
            onFocus={trackFormStart}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Project type (required, select) */}
      <div>
        <label htmlFor="projectType" className={labelClass}>
          {t.projectTypeLabel} {requiredMark}
        </label>
        <select
          id="projectType"
          name="projectType"
          className={inputClass('projectType')}
          onFocus={trackFormStart}
          required
          aria-invalid={!!errors.projectType}
          defaultValue=""
        >
          <option value="" disabled>
            {t.selectProjectType}
          </option>
          {projectTypes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label[locale]}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className={errorClass}>{errors.projectType}</p>
        )}
      </div>

      {/* Message (required) */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {t.messageLabel} {requiredMark}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass('message')}
          onFocus={trackFormStart}
          required
          placeholder={t.messagePlaceholder}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      {/* Optional fields */}
      <div className="border-t border-(--color-border-subtle) pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-secondary)">
          {t.optionalHeader}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            {t.companyLabel}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={inputClass('company')}
          />
        </div>

        <div>
          <label htmlFor="website" className={labelClass}>
            {t.websiteLabel}
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder={t.websitePlaceholder}
            className={inputClass('website')}
          />
          {errors.website && <p className={errorClass}>{errors.website}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="budget" className={labelClass}>
            {t.budgetLabel}
          </label>
          <select
            id="budget"
            name="budget"
            className={inputClass('budget')}
            defaultValue=""
          >
            <option value="">{t.selectPlaceholder}</option>
            {budgetRanges.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label[locale]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className={labelClass}>
            {t.timelineLabel}
          </label>
          <select
            id="timeline"
            name="timeline"
            className={inputClass('timeline')}
            defaultValue=""
          >
            <option value="">{t.selectPlaceholder}</option>
            {timelines.map((tl) => (
              <option key={tl.id} value={tl.id}>
                {tl.label[locale]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="decisionRole" className={labelClass}>
            {t.decisionRoleLabel}
          </label>
          <select
            id="decisionRole"
            name="decisionRole"
            className={inputClass('decisionRole')}
            defaultValue=""
          >
            <option value="">{t.selectPlaceholder}</option>
            {decisionRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="companySize" className={labelClass}>
          {t.companySizeLabel}
        </label>
        <input
          id="companySize"
          name="companySize"
          type="text"
          placeholder={t.companySizePlaceholder}
          className={inputClass('companySize')}
        />
      </div>

      <div>
        <label htmlFor="mainProblem" className={labelClass}>
          {t.mainProblemLabel}
        </label>
        <textarea
          id="mainProblem"
          name="mainProblem"
          rows={2}
          className={inputClass('mainProblem')}
        />
      </div>

      {/* Turnstile widget */}
      {turnstileSiteKey && <div ref={turnstileRef} className="cf-turnstile" />}

      {/* Error state with mailto fallback */}
      {state === 'error' && (
        <div className="flex flex-col gap-2 rounded-xl border border-status-danger/20 bg-status-danger-bg p-4">
          <div className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 shrink-0 text-status-danger"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-sm leading-relaxed text-status-danger">
              {errorMessage}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pl-7 text-sm text-(--color-text-secondary)">
            {t.errorFallback}{' '}
            <a
              href={`mailto:${contactEmail}?subject=Web%20Audit%20Request`}
              className="font-medium text-primary-500 hover:underline"
              data-umami-event="email_click"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3.5 text-base font-semibold text-(--color-text-on-primary) shadow-card transition-all duration-200 hover:bg-primary-600 hover:shadow-raised disabled:opacity-60 disabled:pointer-events-none"
      >
        {state === 'submitting' ? t.submittingButton : t.submitButton}
        {state !== 'submitting' && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </form>
  );
}

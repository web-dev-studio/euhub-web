import { auditRequestSchema, getValidationMessage } from '../../lib/validation';
import type { Locale } from '../../content/types';
import {
  WEBHOOK_URL,
  WEBHOOK_TOKEN,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';

/**
 * Audit Request API endpoint.
 *
 * Per plan v3:
 *  - prerender = false → runs on the Node server (Cloud Run)
 *  - Web-API only: fetch, AbortController, Request/Response
 *  - Validates input with shared Zod schema
 *  - Verifies Cloudflare Turnstile token server-side
 *  - POSTs to WEBHOOK_URL with timeout handling
 *  - No leaking of webhook internals to the user
 *  - Security headers are applied globally by src/middleware.ts; this
 *    endpoint does not set its own copy
 *  - Dev mode: returns success with console warning if WEBHOOK_URL is unset
 */

export const prerender = false;

// Localized error messages
const messages = {
  en: {
    validation: 'Please check the form fields and try again.',
    captcha: 'Verification failed. Please try again.',
    webhook: 'Something went wrong on our end. Please try again or email us.',
    timeout: 'The request timed out. Please try again or email us directly.',
    rateLimited: 'Too many requests. Please try again later.',
  },
  sk: {
    validation: 'Skontrolujte polia formulára a skúste to znova.',
    captcha: 'Overenie zlyhalo. Skúste to znova.',
    webhook: 'Niečo sa pokazilo. Skúste to znova alebo nám napíšte email.',
    timeout: 'Požiadavka vypršala. Skúste to znova alebo nám napíšte email.',
    rateLimited: 'Príliš veľa požiadaviek. Skúste to neskôr.',
  },
} as const;

// Cloudflare Turnstile verification endpoint
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Webhook timeout (ms)
const WEBHOOK_TIMEOUT_MS = 8000;

// Rate limiting: in-memory counter, per Cloud Run container instance.
// NOTE: this is NOT a distributed rate limiter. Cloud Run can run up to
// --max-instances concurrent instances (each with its own independent Map),
// and --min-instances=0 means the Map resets whenever the service scales to
// zero. Treat this as a cheap last-resort backstop, not the real control —
// the actual rate-limiting layer belongs in front of Cloud Run (e.g. a
// Cloud Armor security policy on the load balancer/serverless NEG scoped to
// this path), which is not yet configured. TODO: add a Cloud Armor rate
// limit rule before relying on this endpoint to resist abuse at scale.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

function getClientIp(request: Request): string {
  // Cloud Run's load balancer sets x-forwarded-for; there is no Cloudflare
  // in front of this service anymore, so cf-connecting-ip is never present.
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) return xForwardedFor.split(',')[0]!.trim();
  return 'unknown';
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  // Security headers (CSP, X-Frame-Options, etc.) are applied globally by
  // src/middleware.ts — this response only needs Content-Type here.
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string,
): Promise<boolean> {
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function postToWebhook(
  url: string,
  payload: unknown,
  token?: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('webhook_timeout');
    }
    throw err;
  }
}

export async function POST(context: {
  request: Request;
  locals: Record<string, unknown>;
}): Promise<Response> {
  const { request } = context;
  const ip = getClientIp(request);

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return jsonResponse(
      {
        error: 'rate_limited',
        message: messages.en.rateLimited,
      },
      429,
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: 'invalid_json', message: 'Invalid request body.' },
      400,
    );
  }

  // Validate with shared Zod schema
  const result = auditRequestSchema.safeParse(body);
  if (!result.success) {
    // Try to extract locale from raw body for message localization
    const rawLocale = (body as Record<string, unknown>)?.locale;
    const locale: Locale = rawLocale === 'sk' ? 'sk' : 'en';
    return jsonResponse(
      {
        error: 'validation_error',
        message: messages[locale].validation,
        fields: result.error.issues.map((i) => ({
          field: i.path[0],
          message: getValidationMessage(i.message, locale),
        })),
      },
      422,
    );
  }

  const data = result.data;
  const locale: Locale = data.locale === 'sk' ? 'sk' : 'en';

  // Honeypot check (server-side too)
  if (data.companyUrl) {
    // Silently succeed — don't tell the bot it was caught
    return jsonResponse({ success: true }, 200);
  }

  // Read secrets via astro:env (type-safe, Cloudflare-compatible)
  const webhookUrl = WEBHOOK_URL;
  const webhookToken = WEBHOOK_TOKEN;
  const turnstileSecret = TURNSTILE_SECRET_KEY;

  // Verify Turnstile (if secret is configured)
  if (turnstileSecret && data.turnstileToken) {
    const valid = await verifyTurnstile(
      data.turnstileToken,
      turnstileSecret,
      ip,
    );
    if (!valid) {
      return jsonResponse(
        {
          error: 'captcha_failed',
          message: messages[locale].captcha,
        },
        403,
      );
    }
  }

  // Dev mode: no webhook URL configured
  if (!webhookUrl) {
    console.warn(
      '[audit-request] WEBHOOK_URL not set — returning dev success.',
    );
    return jsonResponse(
      {
        success: true,
        dev: true,
        message: 'Request received (dev mode — no webhook).',
      },
      200,
    );
  }

  // Build webhook payload (strip internal fields)
  const webhookPayload = {
    // Metadata
    submittedAt: new Date().toISOString(),
    source: 'build.euhub.co',
    ip,

    // Form data (strip honeypot + turnstile token)
    name: data.name,
    email: data.email,
    projectType: data.projectType,
    message: data.message,
    company: data.company || undefined,
    website: data.website || undefined,
    companySize: data.companySize || undefined,
    mainProblem: data.mainProblem || undefined,
    budget: data.budget || undefined,
    timeline: data.timeline || undefined,
    decisionRole: data.decisionRole || undefined,
  };

  // POST to webhook
  try {
    const webhookResponse = await postToWebhook(
      webhookUrl,
      webhookPayload,
      webhookToken,
    );

    if (!webhookResponse.ok) {
      console.error(
        `[audit-request] Webhook returned ${webhookResponse.status}`,
      );
      return jsonResponse(
        {
          error: 'webhook_error',
          message: messages[locale].webhook,
        },
        502,
      );
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    if (message === 'webhook_timeout') {
      console.error('[audit-request] Webhook timed out');
      return jsonResponse(
        {
          error: 'webhook_timeout',
          message: messages[locale].timeout,
        },
        504,
      );
    }
    console.error('[audit-request] Webhook failed:', message);
    return jsonResponse(
      {
        error: 'webhook_error',
        message: messages[locale].webhook,
      },
      502,
    );
  }
}

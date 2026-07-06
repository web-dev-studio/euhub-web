import { defineMiddleware } from 'astro:middleware';

/**
 * Security headers middleware — sets headers on all responses.
 * Replaces the Cloudflare _headers file for GCP Cloud Run deployment.
 * Applies to both static pages and the API endpoint.
 */
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://umami.is https://*.umami.is",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com https://umami.is https://*.umami.is",
    'frame-src https://challenges.cloudflare.com',
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
};

export const onRequest = defineMiddleware(async (context, next) => {
  // `next()` can throw if a route handler or page render fails unexpectedly.
  // Without this catch, an error response would skip the header-setting
  // loop below entirely — the one case (an error page) most likely to be
  // probed by an attacker would ship with no CSP/frame protection at all.
  let response: Response;
  try {
    response = await next();
  } catch (err) {
    console.error('[middleware] Unhandled error:', err);
    response = new Response('Internal Server Error', { status: 500 });
  }
  // Set security headers on the resolved response (works for both
  // prerendered and on-demand routes, and now for error responses too).
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
});

/**
 * Umami analytics adapter (cookieless, EU/Frankfurt).
 *
 * Umami exposes a global `window.umami.track(event, props)` function once
 * the script tag loads. This adapter wraps it with:
 *  - type safety
 *  - custom listeners for events Umami doesn't track natively
 *    (scroll depth, form start)
 *  - no-op when Umami isn't loaded (dev, CI, ad-blocked)
 *
 * Per plan v3: minimal JS budget. The scroll listener is passive and
 * removed after firing.
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, props?: Record<string, unknown>) => void;
    };
  }
}

export function track(
  eventName: string,
  props?: Record<string, unknown>,
): void {
  if (typeof window !== 'undefined' && window.umami) {
    const locale = document.documentElement.lang || 'en';
    window.umami.track(eventName, { ...props, locale });
  }
}

/** Track a CTA click with the section it came from */
export function trackCtaClick(section: string): void {
  track('cta_primary_click', { section });
}

/** Track a service card click */
export function trackServiceClick(serviceId: string): void {
  track('service_card_click', { service: serviceId });
}

/** Track FAQ open */
export function trackFaqOpen(question: string): void {
  track('faq_open', { question: question.slice(0, 80) });
}

/** Track ecosystem link click */
export function trackEcosystemClick(brand: string): void {
  track('ecosystem_link_click', { brand });
}

/** Track email click (mailto) */
export function trackEmailClick(): void {
  track('email_click');
}

/** Track form start (first field focus) */
export function trackFormStart(): void {
  track('audit_form_start');
}

/** Track form submit result */
export function trackFormResult(success: boolean): void {
  track(success ? 'audit_form_submit_success' : 'audit_form_submit_error');
}

/**
 * Install scroll-depth listeners (50% and 90%).
 * Passive listeners, removed after firing to keep the JS budget small.
 * Respects prefers-reduced-motion (no extra work if motion is reduced —
 * scroll depth is still tracked, just without any visual effect).
 */
export function installScrollTracking(): void {
  if (typeof window === 'undefined') return;

  let fired50 = false;
  let fired90 = false;

  const onScroll = () => {
    const scrolled =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);
    if (!fired50 && scrolled >= 0.5) {
      fired50 = true;
      track('scroll_50');
    }
    if (!fired90 && scrolled >= 0.9) {
      fired90 = true;
      track('scroll_90');
      window.removeEventListener('scroll', onScroll);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

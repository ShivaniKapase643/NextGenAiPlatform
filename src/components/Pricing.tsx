'use client';

import { useEffect, useRef, useCallback } from 'react';
import { PRICING, computePrice, type CurrencyKey, type BillingCycle, type TierKey } from '@/lib/pricing';
import { ArrowTrendingUpIcon, ChevronRightIcon } from '@/lib/svgs';

/* ─────────────────────────────────────────────────────────────────────────
   STATE ISOLATION ARCHITECTURE
   ─────────────────────────────────────────────────────────────────────────
   The currency and billing state lives in refs — NOT useState.
   React never sees a state change, so the component tree NEVER re-renders
   after the initial mount.

   Price mutations: we keep refs to every price DOM node and write
   `textContent` directly. DevTools paint-flash will light up only those
   exact text nodes — zero surrounding reflow.

   URL sync: replaceState encodes the active currency/billing so the view
   is shareable and deep-linkable without triggering any re-render.
   ───────────────────────────────────────────────────────────────────────── */

const TIERS = Object.entries(PRICING.tiers) as [TierKey, typeof PRICING.tiers[TierKey]][];
const CURRENCIES = Object.keys(PRICING.currency) as CurrencyKey[];

function trackRender(section: string) {
  if (typeof window === 'undefined') return;
  window.__hudCounts = window.__hudCounts ?? {};
  window.__hudCounts[section] = (window.__hudCounts[section] ?? 0) + 1;
  setTimeout(() => window.__dispatchHudUpdate?.(), 0);
}

/* C4: WAAPI blur-up entrance on price text nodes */
const PRICE_KEYFRAMES: Keyframe[] = [
  { opacity: 0, filter: 'blur(6px)', transform: 'translateY(6px)' },
  { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
];
const PRICE_TIMING: KeyframeAnimationOptions = { duration: 180, easing: 'ease-out', fill: 'forwards' };

function animatePriceNode(el: HTMLElement | null) {
  if (!el || !el.animate) return;
  el.animate(PRICE_KEYFRAMES, PRICE_TIMING);
}

export function Pricing() {
  trackRender('pricing');

  /* ── Mutable refs for current selection — zero re-renders ── */
  const currencyRef = useRef<CurrencyKey>('USD');
  const billingRef = useRef<BillingCycle>('monthly');

  /* ── DOM node refs for price display ── */
  const amountRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const symbolRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const periodRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  /* ── Core DOM patcher — touches only price text nodes ── */
  const patchPrices = useCallback(() => {
    TIERS.forEach(([key, tier]) => {
      const result = computePrice(tier.base, currencyRef.current, billingRef.current);
      const amountEl = amountRefs.current[key];
      const symbolEl = symbolRefs.current[key];
      const periodEl = periodRefs.current[key];
      if (amountEl) { amountEl.textContent = result.amount; animatePriceNode(amountEl); }
      if (symbolEl) { symbolEl.textContent = result.symbol; animatePriceNode(symbolEl); }
      if (periodEl) { periodEl.textContent = result.period; animatePriceNode(periodEl); }
    });

    /* Notify HUD of price node paints */
    if (typeof window !== 'undefined') {
      window.__hudPaints = (window.__hudPaints ?? 0) + TIERS.length;
      window.__dispatchHudUpdate?.();
    }

    /* Deep-link URL sync — no re-render */
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('currency', currencyRef.current);
      url.searchParams.set('billing', billingRef.current);
      window.history.replaceState(null, '', url);
    }
  }, []);

  /* ── Currency switcher ── */
  const selectCurrency = useCallback((cur: string) => {
    if (!Object.keys(PRICING.currency).includes(cur)) return;
    currencyRef.current = cur as CurrencyKey;
    /* Update button active states via DOM — no state setter */
    document.querySelectorAll<HTMLButtonElement>('[data-currency-btn]').forEach((btn) => {
      btn.setAttribute('data-active', String(btn.dataset.currencyBtn === cur));
      btn.setAttribute('aria-pressed', String(btn.dataset.currencyBtn === cur));
    });
    patchPrices();
  }, [patchPrices]);

  /* ── Billing toggle ── */
  const selectBilling = useCallback((cycle: string) => {
    if (cycle !== 'monthly' && cycle !== 'annual') return;
    billingRef.current = cycle as BillingCycle;
    document.querySelectorAll<HTMLButtonElement>('[data-billing-btn]').forEach((btn) => {
      btn.setAttribute('data-active', String(btn.dataset.billingBtn === cycle));
      btn.setAttribute('aria-pressed', String(btn.dataset.billingBtn === cycle));
    });
    /* Show/hide annual savings badge */
    const badge = document.getElementById('annual-savings-badge');
    if (badge) badge.style.opacity = cycle === 'annual' ? '1' : '0';
    patchPrices();
  }, [patchPrices]);

  /* ── Hydrate from URL on mount, then patch prices ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCurrency = params.get('currency') as CurrencyKey | null;
    const urlBilling = params.get('billing') as BillingCycle | null;

    if (urlCurrency && PRICING.currency[urlCurrency]) {
      currencyRef.current = urlCurrency;
      document.querySelectorAll<HTMLButtonElement>('[data-currency-btn]').forEach((btn) => {
        btn.setAttribute('data-active', String(btn.dataset.currencyBtn === urlCurrency));
        btn.setAttribute('aria-pressed', String(btn.dataset.currencyBtn === urlCurrency));
      });
    }
    if (urlBilling === 'annual' || urlBilling === 'monthly') {
      billingRef.current = urlBilling;
      document.querySelectorAll<HTMLButtonElement>('[data-billing-btn]').forEach((btn) => {
        btn.setAttribute('data-active', String(btn.dataset.billingBtn === urlBilling));
      });
    }

    patchPrices();

    /* Expose to command palette */
    window.__pricingSelectCurrency = selectCurrency;
    window.__pricingSelectBilling = selectBilling;
  }, [patchPrices, selectCurrency, selectBilling]);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="section-pad"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="tag mb-4 inline-flex">
            <ArrowTrendingUpIcon size={12} aria-hidden="true" />
            Simple Pricing
          </div>
          <h2
            id="pricing-heading"
            className="font-mono font-bold text-text-primary mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            Choose your{' '}
            <span className="gradient-text">growth tier</span>
          </h2>
          <p className="font-sans text-text-secondary max-w-xl mx-auto text-[1.0625rem]">
            Every plan includes a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 reveal">
          {/* Billing toggle */}
          <div className="toggle-pill" role="group" aria-label="Billing cycle">
            <button
              data-billing-btn="monthly"
              data-active="true"
              aria-pressed="true"
              className="toggle-pill-btn"
              onClick={() => selectBilling('monthly')}
            >
              Monthly
            </button>
            <button
              data-billing-btn="annual"
              data-active="false"
              aria-pressed="false"
              className="toggle-pill-btn"
              onClick={() => selectBilling('annual')}
            >
              Annual
            </button>
          </div>

          {/* Annual savings badge */}
          <span
            id="annual-savings-badge"
            className="tag text-xs"
            style={{ opacity: 0, transition: 'opacity 175ms ease-out' }}
            aria-live="polite"
          >
            Save 20%
          </span>

          {/* Currency switcher */}
          <div
            className="flex items-center gap-1.5 p-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]"
            role="group"
            aria-label="Currency"
          >
            {CURRENCIES.map((cur) => (
              <button
                key={cur}
                data-currency-btn={cur}
                data-active={cur === 'USD' ? 'true' : 'false'}
                aria-pressed={cur === 'USD' ? 'true' : 'false'}
                className="currency-btn"
                onClick={() => selectCurrency(cur)}
              >
                {PRICING.currency[cur].symbol} {cur}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tier cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          {TIERS.map(([key, tier]) => (
            <article
              key={key}
              className={`pricing-card flex flex-col ${tier.highlighted ? 'featured' : ''}`}
              aria-label={`${tier.label} plan`}
            >
              {/* Tier header */}
              <div className="mb-6">
                {tier.highlighted && (
                  <div className="tag text-xs mb-3 inline-flex">Most Popular</div>
                )}
                <h3 className="font-mono font-bold text-xl text-text-primary mb-2">
                  {tier.label}
                </h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Price display — THESE are the isolated text nodes */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1" aria-live="polite" aria-atomic="true">
                  <span
                    ref={(el) => { symbolRefs.current[key] = el; }}
                    data-price-node
                    className="font-mono font-bold text-2xl text-forsythia"
                    aria-label="Currency symbol"
                  >
                    $
                  </span>
                  <span
                    ref={(el) => { amountRefs.current[key] = el; }}
                    data-price-node
                    className="font-mono font-bold text-text-primary"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                    aria-label="Price amount"
                  >
                    {tier.base}
                  </span>
                  <span
                    ref={(el) => { periodRefs.current[key] = el; }}
                    data-price-node
                    className="font-sans text-sm text-text-muted ml-1"
                    aria-label="Billing period"
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="flex flex-col gap-3 mb-8 flex-1" role="list">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--forsythia)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span className="font-sans text-sm text-text-secondary">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={tier.highlighted ? 'btn-primary justify-center' : 'btn-outline justify-center'}
                style={!tier.highlighted ? { color: 'var(--text-primary)', borderColor: 'var(--border-color)' } : {}}
                aria-label={`${tier.cta} — ${tier.label} plan`}
              >
                {tier.cta}
                <ChevronRightIcon size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        {/* Money-back note */}
        <p className="text-center font-sans text-sm text-text-muted mt-8 reveal">
          All plans include 14-day free trial · No credit card required · Cancel any time
        </p>
      </div>
    </section>
  );
}


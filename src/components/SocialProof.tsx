'use client';

import { useEffect, useRef } from 'react';
import { ChartPieIcon, ArrowTrendingUpIcon, ArrowPathIcon } from '@/lib/svgs';

function trackRender(section: string) {
  if (typeof window === 'undefined') return;
  window.__hudCounts = window.__hudCounts ?? {};
  window.__hudCounts[section] = (window.__hudCounts[section] ?? 0) + 1;
  setTimeout(() => window.__dispatchHudUpdate?.(), 0);
}

const TESTIMONIALS = [
  {
    quote:
      'NextSync cut our data pipeline build time from two weeks to one afternoon. The real-time sync is borderline magic — our analytics dashboards now update before the transaction even settles.',
    author: 'Priya Sharma',
    role: 'Head of Data Engineering',
    company: 'FinEdge Technologies',
    avatar: 'PS',
  },
  {
    quote:
      'We replaced three separate tools — an ETL runner, a monitoring platform, and a custom API gateway — with NextSync alone. The ROI was visible within the first billing cycle.',
    author: 'Marcus Chen',
    role: 'CTO',
    company: 'Voxel Commerce',
    avatar: 'MC',
  },
  {
    quote:
      'The anomaly detection caught a rogue cron job eating our budget at 2 AM — before it caused damage. That one alert paid for the annual subscription many times over.',
    author: 'Lena Fischer',
    role: 'Platform Engineering Lead',
    company: 'Scalehaus GmbH',
    avatar: 'LF',
  },
];

/* Faux wordmarks (B4): letter-spacing + light weight gives a neutral "brand" feel */
const LOGOS = [
  { name: 'FinEdge', accent: 'Edge' },
  { name: 'Voxel', accent: 'xel' },
  { name: 'Scalehaus', accent: 'haus' },
  { name: 'Arcapath', accent: 'path' },
  { name: 'Novarift', accent: 'rift' },
  { name: 'Synthlab', accent: 'lab' },
];

/* Stat config — target numeric value + formatter (C1 count-up) */
const STATS: {
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  target: number;
  display: string;
  format: (v: number) => string;
  label: string;
}[] = [
  {
    icon: ArrowTrendingUpIcon,
    target: 3400,
    display: '3,400+',
    format: (v) => `${Math.round(v).toLocaleString()}+`,
    label: 'Companies worldwide',
  },
  {
    icon: ArrowPathIcon,
    target: 10,
    display: '10B+',
    format: (v) => `${Math.round(v)}B+`,
    label: 'Events processed daily',
  },
  {
    icon: ChartPieIcon,
    target: 99.99,
    display: '99.99%',
    format: (v) => `${v.toFixed(2)}%`,
    label: 'Platform uptime',
  },
];

/* Easing — ease-out cubic */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function SocialProof() {
  trackRender('social');
  const statRefs = useRef<(HTMLElement | null)[]>([]);
  const animated = useRef(false);

  /* C1: Count-up via rAF, triggered by IntersectionObserver */
  useEffect(() => {
    const DURATION = 1400; // ms

    const runCountUp = () => {
      if (animated.current) return;
      animated.current = true;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = easeOut(progress);

        STATS.forEach((stat, i) => {
          const el = statRefs.current[i];
          if (el) el.textContent = stat.format(stat.target * eased);
        });

        if (progress < 1) requestAnimationFrame(tick);
        else {
          STATS.forEach((stat, i) => {
            const el = statRefs.current[i];
            if (el) el.textContent = stat.display;
          });
        }
      };

      requestAnimationFrame(tick);
    };

    const sentinel = statRefs.current[0]?.closest('[data-stats-section]') as HTMLElement | null;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Logo strip (B4 — faux wordmarks) ── */}
      <section
        aria-label="Trusted by these companies"
        className="py-12 border-y border-[var(--border-color)] overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center font-mono text-xs tracking-widest uppercase text-text-muted mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {LOGOS.map(({ name, accent }) => {
              const prefix = name.slice(0, name.length - accent.length);
              return (
                <span
                  key={name}
                  className="logo-wordmark"
                  aria-label={`${name} uses NextSync AI`}
                >
                  <span className="logo-wordmark__prefix">{prefix}</span>
                  <span className="logo-wordmark__accent">{accent}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats (C1 count-up) ── */}
      <section
        aria-labelledby="stats-heading"
        className="section-pad"
        style={{ background: 'var(--bg-primary)' }}
        data-stats-section
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 id="stats-heading" className="sr-only">Platform statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center reveal">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-dim)] flex items-center justify-center">
                      <Icon size={22} className="text-forsythia" aria-hidden="true" />
                    </div>
                  </div>
                  <p
                    className="stat-number mb-2"
                    ref={(el) => { statRefs.current[i] = el; }}
                    aria-live="polite"
                  >
                    {stat.display}
                  </p>
                  <p className="font-sans text-text-secondary">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="section-pad"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <h2
              id="testimonials-heading"
              className="font-mono font-bold text-text-primary mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              What builders are <span className="gradient-text">saying</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={t.author}
                className={`testimonial-card reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''}`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--forsythia)" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full bg-[var(--accent-dim)] flex items-center justify-center font-mono text-xs font-bold text-forsythia flex-shrink-0"
                      aria-hidden="true"
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <cite className="not-italic font-sans font-semibold text-sm text-text-primary block">
                        {t.author}
                      </cite>
                      <span className="font-sans text-xs text-text-muted">
                        {t.role}, {t.company}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="section-pad"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            id="faq-heading"
            className="font-mono font-bold text-text-primary mb-10 text-center reveal"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            Frequently Asked
          </h2>

          <FaqItem
            question="Can I change plans at any time?"
            answer="Yes. Upgrades take effect immediately and you're charged the prorated difference. Downgrades take effect at the start of your next billing cycle."
          />
          <FaqItem
            question="Is there a free trial?"
            answer="Every plan comes with a full 14-day free trial. No credit card required — just sign up and start syncing."
          />
          <FaqItem
            question="Do you offer discounts for annual billing?"
            answer="Yes — switching to annual billing gives you a flat 20% discount. You can see the exact savings for your currency using the toggle in the Pricing section."
          />
          <FaqItem
            question="How does pricing work for multiple currencies?"
            answer="All base prices are in USD. INR and EUR prices are computed using live regional tariff factors. Toggle the currency switcher in the Pricing section to see your local equivalent."
          />
          <FaqItem
            question="What data sources are supported?"
            answer="We support 200+ native connectors including PostgreSQL, MySQL, BigQuery, Snowflake, Kafka, S3, Stripe, Salesforce, HubSpot, and any REST or GraphQL API."
          />
        </div>
      </section>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const itemRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const item = itemRef.current;
    if (!item) return;
    const isOpen = item.getAttribute('data-open') === 'true';
    item.setAttribute('data-open', String(!isOpen));
    item.querySelector('button')?.setAttribute('aria-expanded', String(!isOpen));
  };

  return (
    <div className="faq-item reveal" ref={itemRef} data-open="false">
      <button
        className="faq-trigger"
        onClick={toggle}
        aria-expanded="false"
      >
        <span className="font-sans font-medium text-text-primary">{question}</span>
        <svg
          className="faq-chevron flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="faq-body" role="region">
        {/* A2: min-height:0 is on .faq-body-inner via CSS; padding lives on .faq-body-content */}
        <div className="faq-body-inner">
          <div className="faq-body-content">
            <p className="font-sans text-sm text-text-secondary leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

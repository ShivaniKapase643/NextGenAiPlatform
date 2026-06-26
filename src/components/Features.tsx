'use client';

import { useEffect, useRef } from 'react';
import {
  ArrowPathIcon, ChartPieIcon, ArrowTrendingUpIcon,
  Cog8ToothIcon, LinkSolidIcon, Cube16SolidIcon,
  ChevronDownIcon,
} from '@/lib/svgs';
import { ThreeDataGraph } from './ThreeDataGraph';

/* ─── Feature data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: ArrowPathIcon,
    title: 'Real-time Sync',
    label: 'arrow-path',
    summary: 'Sub-millisecond bidirectional sync across 200+ sources.',
    body: 'Our event-driven architecture keeps every replica in perfect sync. Changes propagate in under 2ms with conflict-free CRDT merging — no manual reconciliation, ever.',
    color: '#FFC801',
    stat: '<2ms',
    statLabel: 'sync latency',
    visual: 'sync',
  },
  {
    icon: ChartPieIcon,
    title: 'Smart Analytics',
    label: 'chart-pie',
    summary: 'Live dashboards that adapt to your data shape automatically.',
    body: 'Dashboards self-compose from your schema using our graph-based layout engine. Query petabytes with columnar OLAP performance — results stream back before you finish typing.',
    color: '#4ADE80',
    stat: '10B+',
    statLabel: 'events / day',
    visual: 'analytics',
  },
  {
    icon: ArrowTrendingUpIcon,
    title: 'Predictive AI',
    label: 'arrow-trending-up',
    summary: 'Spot anomalies and forecast trends before they surface.',
    body: 'Embedded ML models run inline on your data streams, flagging anomalies in real time. Our AutoML layer retrains weekly on your evolving patterns — no data science team required.',
    color: '#A78BFA',
    stat: '94%',
    statLabel: 'prediction accuracy',
    visual: 'trend',
  },
  {
    icon: Cog8ToothIcon,
    title: 'Workflow Engine',
    label: 'cog-8-tooth',
    summary: 'Visual orchestration for complex multi-step automation.',
    body: 'Drag-and-drop DAG builder with branching logic, retries, and dead-letter queues built in. Deploy pipelines in one click — they scale to zero when idle and burst to thousands of workers.',
    color: '#F87171',
    stat: '99.99%',
    statLabel: 'pipeline uptime',
    visual: 'workflow',
  },
  {
    icon: LinkSolidIcon,
    title: 'API Mesh',
    label: 'link-solid',
    summary: 'Unified GraphQL & REST gateway across all your services.',
    body: 'Stitch every REST, GraphQL, gRPC, and WebSocket endpoint into a single federated API. Rate limiting, auth, caching, and schema versioning handled transparently at the edge.',
    color: '#38BDF8',
    stat: '200+',
    statLabel: 'connectors',
    visual: 'api',
  },
  {
    icon: Cube16SolidIcon,
    title: '3D Data Graph',
    label: 'cube-16-solid',
    summary: 'Visualise data lineage and relationships in 3D space.',
    body: 'Interactive force-directed graph renders your entire data lineage — click any node to trace dependencies, impact surfaces, and PII propagation paths across your full estate.',
    color: '#FB923C',
    stat: '360°',
    statLabel: 'lineage visibility',
    visual: 'three',
  },
] as const;

/* ─── Module-level active index (NOT React state) ─────── */
let ACTIVE_IDX = 0;

function trackRender(section: string) {
  if (typeof window === 'undefined') return;
  window.__hudCounts = window.__hudCounts ?? {};
  window.__hudCounts[section] = (window.__hudCounts[section] ?? 0) + 1;
  setTimeout(() => window.__dispatchHudUpdate?.(), 0);
}

/* ─── Inline bento visual textures (B3) ──────────────── */
function BentoVisual({ type, color }: { type: string; color: string }) {
  if (type === 'sync') {
    return (
      <div className="bento-visual bento-visual--sync mt-auto" aria-hidden="true">
        <div className="sync-ring" style={{ borderColor: color }} />
        <div className="sync-ring" style={{ borderColor: color }} />
        <div className="sync-ring" style={{ borderColor: color }} />
        <div className="sync-dot" style={{ background: color }} />
      </div>
    );
  }

  if (type === 'analytics') {
    /* Mini bar chart using inline SVG */
    const bars = [30, 55, 40, 70, 50, 85, 60, 90, 72, 95];
    return (
      <div className="bento-visual mt-auto" aria-hidden="true" style={{ height: 48 }}>
        <svg viewBox="0 0 100 40" width="100%" height="48" preserveAspectRatio="none">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={i * 11}
              y={40 - h * 0.38}
              width={8}
              height={h * 0.38}
              rx={2}
              fill={color}
              opacity={0.15 + i * 0.08}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (type === 'trend') {
    /* Sparkline */
    const pts = [60, 45, 55, 40, 52, 35, 30, 22, 18, 10];
    const path = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 11} ${y}`).join(' ');
    return (
      <div className="bento-visual mt-auto" aria-hidden="true" style={{ height: 48 }}>
        <svg viewBox="0 0 100 65" width="100%" height="48" preserveAspectRatio="none">
          <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          <circle cx={pts.length * 11 - 11} cy={pts[pts.length - 1]} r={4} fill={color} opacity={0.9} />
        </svg>
      </div>
    );
  }

  if (type === 'workflow') {
    return (
      <div className="bento-visual mt-auto" aria-hidden="true" style={{ height: 36 }}>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="workflow-dot" style={i === 0 ? { background: color } : {}} />
              {i < 4 && <div style={{ width: 16, height: 1, background: 'var(--border-color)' }} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'api') {
    /* Mesh lines */
    return (
      <div className="bento-visual mt-auto" aria-hidden="true" style={{ height: 44 }}>
        <svg viewBox="0 0 100 40" width="100%" height="44" preserveAspectRatio="xMidYMid meet">
          {[[10,20],[30,8],[50,25],[70,10],[90,20]].map(([x,y], i, arr) => {
            const pairs: [number,number][] = [];
            for (let j = i+1; j < arr.length; j++) {
              if (Math.abs(arr[j][0]-x) < 50) pairs.push([arr[j][0], arr[j][1]]);
            }
            return pairs.map(([tx,ty]) => (
              <line key={`${x}-${tx}`} x1={x} y1={y} x2={tx} y2={ty} stroke={color} strokeWidth={0.8} opacity={0.35} />
            ));
          })}
          {[[10,20],[30,8],[50,25],[70,10],[90,20]].map(([x,y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={color} opacity={0.75} />
          ))}
        </svg>
      </div>
    );
  }

  /* 'three' — rendered inline via ThreeDataGraph */
  return null;
}

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  trackRender('features');

  /* ── Direct-DOM helpers ─────────────────────────────── */
  function activateBento(idx: number) {
    containerRef.current?.querySelectorAll<HTMLElement>('[data-feature-item]').forEach((el, i) => {
      el.setAttribute('data-active', String(i === idx));
    });
  }

  function openAccordionAt(idx: number, toggle = false) {
    containerRef.current?.querySelectorAll<HTMLElement>('[data-feature-item]').forEach((el, i) => {
      const wasOpen = el.getAttribute('data-open') === 'true';
      const isOpen = toggle ? (i === idx ? !wasOpen : false) : (i === idx);
      el.setAttribute('data-open', String(isOpen));
      el.querySelector('button[data-accordion-trigger]')?.setAttribute('aria-expanded', String(isOpen));
    });
    if (!toggle) ACTIVE_IDX = idx;
  }

  function assignVTNames() {
    containerRef.current?.querySelectorAll<HTMLElement>('[data-feature-item]').forEach((el, i) => {
      el.style.viewTransitionName = `feature-card-${i}`;
    });
  }

  /* ── Resize / Context-Lock breakpoint listener ──────── */
  useEffect(() => {
    assignVTNames();
    const mq = window.matchMedia('(max-width: 767px)');

    const applyMode = (isMobile: boolean, withTransition = false) => {
      const container = containerRef.current;
      if (!container) return;
      const doMutation = () => {
        container.setAttribute('data-mode', isMobile ? 'accordion' : 'bento');
        if (isMobile) openAccordionAt(ACTIVE_IDX);
        else activateBento(ACTIVE_IDX);
      };
      if (withTransition && 'startViewTransition' in document) {
        (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(doMutation);
      } else {
        doMutation();
      }
    };

    applyMode(mq.matches, false);
    const handleChange = (e: MediaQueryListEvent) => applyMode(e.matches, true);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBentoEnter = (idx: number) => {
    ACTIVE_IDX = idx;
    activateBento(idx);
  };

  const handleAccordionToggle = (idx: number) => {
    ACTIVE_IDX = idx;
    openAccordionAt(idx, true);
  };

  /* ── Cursor-glow spotlight (C2) — pure CSS var write, no setState ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="section-pad max-w-7xl mx-auto px-6"
    >
      <div className="text-center mb-14 reveal">
        <div className="tag mb-4 inline-flex">
          <Cube16SolidIcon size={12} aria-hidden="true" />
          Core Capabilities
        </div>
        <h2
          id="features-heading"
          className="font-mono font-bold text-text-primary mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          Everything your data needs,{' '}
          <span className="gradient-text">nothing it doesn&apos;t</span>
        </h2>
        <p className="font-sans text-text-secondary max-w-2xl mx-auto text-[1.0625rem]">
          A vertically integrated platform — sync, transform, analyse, and act on data
          without stitching together a dozen tools.
        </p>
      </div>

      {/* ── Bento / Accordion container ─────────────── */}
      <div
        ref={containerRef}
        data-mode="bento"
        className="features-grid"
        aria-label="Product features"
      >
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <article
              key={feat.label}
              data-feature-item
              data-index={i}
              data-active={i === 0 ? 'true' : 'false'}
              data-open="false"
              className="feature-card reveal"
              onMouseEnter={() => handleBentoEnter(i)}
              onFocus={() => handleBentoEnter(i)}
              onMouseMove={handleMouseMove}
            >
              {/* ── BENTO content (desktop only — accordion-body hidden via CSS) ── */}
              <div className="bento-content p-[1.75rem] h-full flex flex-col gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feat.color}20` }}
                >
                  <Icon size={20} style={{ color: feat.color }} aria-hidden="true" />
                </div>

                <div>
                  <h3 className="font-mono font-semibold text-lg text-text-primary mb-2">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">
                    {feat.body}
                  </p>
                </div>

                {/* Stat */}
                <div className="pt-3 border-t border-[var(--border-color)]">
                  <span className="font-mono font-bold text-2xl" style={{ color: feat.color }}>
                    {feat.stat}
                  </span>
                  <span className="font-sans text-xs text-text-muted ml-2">{feat.statLabel}</span>
                </div>

                {/* B3: Visual texture — or three.js for card 5 */}
                {feat.visual === 'three' ? (
                  <div className="bento-visual mt-auto" style={{ height: 120, flexShrink: 0 }}>
                    <ThreeDataGraph className="w-full h-full" />
                  </div>
                ) : (
                  <BentoVisual type={feat.visual} color={feat.color} />
                )}
              </div>

              {/* ── ACCORDION trigger (mobile only — shown via CSS) ── */}
              <button
                data-accordion-trigger
                aria-expanded="false"
                aria-controls={`feature-body-${i}`}
                id={`feature-trigger-${i}`}
                className="accordion-trigger w-full flex items-center gap-3 px-4 py-3.5 text-left"
                onClick={() => handleAccordionToggle(i)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feat.color}20` }}
                >
                  <Icon size={16} style={{ color: feat.color }} aria-hidden="true" />
                </div>
                <span className="font-mono font-semibold text-sm text-text-primary flex-1">
                  {feat.title}
                </span>
                <ChevronDownIcon size={16} className="chevron text-text-muted" aria-hidden="true" />
              </button>

              {/* ── ACCORDION body (mobile only — hidden on desktop via CSS) ── */}
              <div
                className="accordion-body"
                id={`feature-body-${i}`}
                role="region"
                aria-labelledby={`feature-trigger-${i}`}
              >
                <div className="accordion-body-inner px-4 pb-4">
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-3">
                    {feat.body}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-bold text-xl" style={{ color: feat.color }}>
                      {feat.stat}
                    </span>
                    <span className="font-sans text-xs text-text-muted">{feat.statLabel}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

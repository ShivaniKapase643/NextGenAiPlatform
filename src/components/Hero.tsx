'use client';

import { useEffect, useRef } from 'react';
import { ArrowPathIcon, ChevronRightIcon } from '@/lib/svgs';

/* ─── Inline product dashboard mockup ────────────────────────────
   Pure CSS animations — no library, no JS after mount.
   Uses CSS vars so it adapts to both dark and light themes.
   ─────────────────────────────────────────────────────────────── */
const LOG_ENTRIES = [
  { time: '14:32:01', msg: 'db.users → warehouse', lat: '1.2ms' },
  { time: '14:32:01', msg: 'stripe.events webhook', lat: '0.8ms' },
  { time: '14:32:02', msg: 'anomaly.detector run', lat: '4.1ms' },
  { time: '14:32:02', msg: 'kafka.orders → analytics', lat: '1.9ms' },
  { time: '14:32:03', msg: 'hubspot.contacts sync', lat: '2.3ms' },
  { time: '14:32:03', msg: 'postgres → redshift', lat: '1.1ms' },
  { time: '14:32:04', msg: 'snowflake.events pull', lat: '3.4ms' },
  { time: '14:32:04', msg: 'ml.forecast pipeline', lat: '5.2ms' },
];

const PIPELINES = [
  { name: 'Data Ingestion', pct: 94, color: '#FFC801' },
  { name: 'ML Pipeline',    pct: 78, color: '#4ADE80' },
  { name: 'API Gateway',    pct: 89, color: '#38BDF8' },
];

const METRICS = [
  { val: '10B+',   label: 'Events/day', color: '#FFC801' },
  { val: '<2ms',   label: 'Latency',    color: '#4ADE80' },
  { val: '99.99%', label: 'Uptime',     color: '#38BDF8' },
];

function HeroDashboard() {
  /* Double the entries so the seamless infinite scroll works */
  const rows = [...LOG_ENTRIES, ...LOG_ENTRIES];

  return (
    <div className="hero-dashboard" role="img" aria-label="NextSync AI live dashboard preview">
      {/* macOS-style window chrome */}
      <div className="dash-chrome">
        <div className="dash-dots">
          <span className="dash-dot dash-dot-r" />
          <span className="dash-dot dash-dot-y" />
          <span className="dash-dot dash-dot-g" />
        </div>
        <span className="dash-win-title">NextSync · Live Dashboard</span>
        <div className="dash-live">
          <span className="live-pulse" aria-hidden="true" />
          LIVE
        </div>
      </div>

      {/* Metric strip */}
      <div className="dash-metrics" aria-label="Key metrics">
        {METRICS.map((m) => (
          <div key={m.label} className="dash-metric">
            <span className="dash-metric-val" style={{ color: m.color }}>{m.val}</span>
            <span className="dash-metric-lbl">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Data pipeline bars */}
      <div className="dash-pipelines" aria-label="Pipeline status">
        {PIPELINES.map((p, i) => (
          <div key={p.name} className="dash-pipe-row">
            <span className="dash-pipe-name">{p.name}</span>
            <div className="dash-pipe-track" role="progressbar" aria-valuenow={p.pct} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="dash-pipe-fill"
                style={{ '--pipe-w': `${p.pct}%`, '--pipe-delay': `${i * 0.18}s`, background: p.color } as React.CSSProperties}
              />
            </div>
            <span className="dash-pipe-pct" style={{ color: p.color }}>{p.pct}%</span>
          </div>
        ))}
      </div>

      {/* Scrolling activity log */}
      <div className="dash-log">
        <div className="dash-log-hdr">
          <span className="dash-log-title">Activity Stream</span>
          <span className="dash-log-rate" aria-label="3400 events per second">↑ 3.4K/s</span>
        </div>
        <div className="dash-log-viewport" aria-hidden="true">
          <div className="dash-log-scroll">
            {rows.map((entry, i) => (
              <div key={i} className="dash-log-row">
                <span className="dash-log-time">{entry.time}</span>
                <span className="dash-log-msg">{entry.msg}</span>
                <span className="dash-log-lat">{entry.lat}</span>
                <span className="dash-log-ok">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function trackRender(section: string) {
  if (typeof window === 'undefined') return;
  window.__hudCounts = window.__hudCounts ?? {};
  window.__hudCounts[section] = (window.__hudCounts[section] ?? 0) + 1;
  setTimeout(() => window.__dispatchHudUpdate?.(), 0);
}

export function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);
  trackRender('hero');

  /* Subtle parallax on orbs */
  useEffect(() => {
    const orbs = orbRef.current?.querySelectorAll<HTMLElement>('.mesh-orb');
    if (!orbs) return;
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      orbs.forEach((orb, i) => {
        const f = (i + 1) * 0.012;
        orb.style.transform = `translate(${(e.clientX - cx) * f}px,${(e.clientY - cy) * f}px)`;
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col justify-center hero-bg overflow-hidden pt-16"
    >
      {/* Background mesh orbs */}
      <div ref={orbRef} aria-hidden="true">
        <div
          className="mesh-orb w-[500px] h-[500px] opacity-25"
          style={{ background: 'radial-gradient(circle, #FFC801 0%, transparent 70%)', top: '-60px', right: '5%', animationDelay: '0s' }}
        />
        <div
          className="mesh-orb w-[350px] h-[350px] opacity-20"
          style={{ background: 'radial-gradient(circle, #114C5A 0%, transparent 70%)', bottom: '15%', left: '-40px', animationDelay: '-5s' }}
        />
        <div
          className="mesh-orb w-[250px] h-[250px] opacity-10"
          style={{ background: 'radial-gradient(circle, #FFC801 0%, transparent 70%)', top: '50%', left: '35%', animationDelay: '-9s' }}
        />
      </div>

      {/* ── Two-column hero layout ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div>
            <div className="tag mb-8 reveal">
              <ArrowPathIcon size={12} aria-hidden="true" />
              AI-Powered Data Automation
            </div>

            <h1
              id="hero-heading"
              className="font-mono font-bold leading-[1.05] mb-6 reveal"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', color: 'var(--arctic-powder)' }}
            >
              Automate Your{' '}
              <span className="gradient-text">Data Universe</span>{' '}
              in Real Time
            </h1>

            <p
              className="font-sans max-w-xl leading-relaxed mb-10 reveal-delay-1"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(241,246,244,0.7)' }}
            >
              NextSync AI connects every data source, transforms streams on the fly,
              and delivers predictive insights — with zero infrastructure overhead
              and millisecond latency.
            </p>

            <div className="flex flex-wrap gap-4 reveal-delay-2">
              <a href="#pricing" className="btn-primary text-base">
                Start Free Trial
                <ChevronRightIcon size={16} aria-hidden="true" />
              </a>
              <a
                href="#features"
                className="btn-outline text-base"
                style={{ color: 'var(--arctic-powder)', borderColor: 'rgba(241,246,244,0.25)' }}
              >
                Explore Features
              </a>
            </div>

            {/* Quick trust signals */}
            <div className="flex flex-wrap gap-6 mt-10 reveal-delay-2">
              {[
                { val: '99.99%', label: 'Uptime' },
                { val: '<2ms', label: 'Latency' },
                { val: '14 days', label: 'Free trial' },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="font-mono font-bold text-forsythia text-xl">{val}</span>
                  <span className="font-sans text-sm" style={{ color: 'rgba(241,246,244,0.5)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live product dashboard preview */}
          <div className="hidden lg:flex items-center justify-center reveal-delay-1">
            <HeroDashboard />
          </div>
        </div>
      </div>

      {/* Scroll indicator — positioned at section bottom, no overlap (A4) */}
      <div
        className="scroll-indicator absolute bottom-6 left-1/2 flex flex-col items-center gap-2 z-10"
        style={{ transform: 'translateX(-50%)', color: 'rgba(241,246,244,0.3)' }}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(241,246,244,0.3), transparent)' }} />
      </div>
    </section>
  );
}

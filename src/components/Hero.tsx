'use client';

import { useEffect, useRef } from 'react';
import { ArrowPathIcon, ChevronRightIcon } from '@/lib/svgs';
import { HeroCanvas } from './HeroCanvas';

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
              className="font-mono font-bold text-arctic-powder leading-[1.05] mb-6 reveal"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
            >
              Automate Your{' '}
              <span className="gradient-text">Data Universe</span>{' '}
              in Real Time
            </h1>

            <p
              className="font-sans text-arctic-powder/70 max-w-xl leading-relaxed mb-10 reveal-delay-1"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}
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
              <a href="#features" className="btn-outline text-base">
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
                  <span className="font-sans text-sm text-arctic-powder/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating node constellation */}
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ height: '420px' }}
            aria-hidden="true"
          >
            {/* Faint container glow */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(255,200,1,0.06) 0%, transparent 70%)' }}
            />
            <HeroCanvas />

            {/* Floating stat chips over canvas */}
            {[
              { val: '10B+', label: 'Events/day', top: '12%', left: '8%' },
              { val: '3,400+', label: 'Customers', top: '70%', right: '6%' },
              { val: '200+', label: 'Connectors', bottom: '10%', left: '15%' },
            ].map(({ val, label, ...pos }) => (
              <div
                key={label}
                className="absolute flex flex-col items-center bg-nocturnal-dark/80 backdrop-blur-sm border border-forsythia/20 rounded-xl px-3 py-2"
                style={pos}
              >
                <span className="font-mono font-bold text-forsythia text-lg leading-none">{val}</span>
                <span className="font-sans text-[10px] text-arctic-powder/50 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — positioned at section bottom, no overlap (A4) */}
      <div
        className="scroll-indicator absolute bottom-6 left-1/2 flex flex-col items-center gap-2 text-arctic-powder/30 z-10"
        style={{ transform: 'translateX(-50%)' }}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-arctic-powder/30 to-transparent" />
      </div>
    </section>
  );
}

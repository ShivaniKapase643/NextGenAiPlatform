'use client';

import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@/lib/svgs';

type Counts = {
  hero: number;
  features: number;
  pricing: number;
  social: number;
  footer: number;
};

const INITIAL: Counts = { hero: 0, features: 0, pricing: 0, social: 0, footer: 0 };

const SECTION_LABELS: Record<keyof Counts, string> = {
  hero: 'Hero',
  features: 'Features',
  pricing: 'Pricing',
  social: 'Social Proof',
  footer: 'Footer',
};

export function RenderHUD() {
  const [visible, setVisible] = useState(true);
  const [counts, setCounts] = useState<Counts>(INITIAL);
  const [paints, setPaints] = useState(0);
  const paintRef = useRef(0);

  useEffect(() => {
    /* Register the global dispatch fn so other components can ping the HUD.
       Deferred via setTimeout so calling it during another component's render
       phase does NOT violate React's setState-during-render rule. */
    window.__dispatchHudUpdate = () => {
      setTimeout(() => {
        const c = window.__hudCounts ?? {};
        setCounts({
          hero: c.hero ?? 0,
          features: c.features ?? 0,
          pricing: c.pricing ?? 0,
          social: c.social ?? 0,
          footer: c.footer ?? 0,
        });
        paintRef.current = window.__hudPaints ?? 0;
        setPaints(window.__hudPaints ?? 0);
      }, 0);
    };

    /* MutationObserver on price nodes to count DOM text patches */
    const observer = new MutationObserver(() => {
      window.__hudPaints = (window.__hudPaints ?? 0) + 1;
      paintRef.current = window.__hudPaints;
      setPaints(window.__hudPaints);
    });

    /* Observe after a tick so price nodes are mounted */
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-price-node]').forEach((node) => {
        observer.observe(node, { characterData: true, childList: true, subtree: true });
      });
    }, 300);

    /* Allow command palette to toggle HUD */
    window.__hudToggle = () => setVisible((v) => !v);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      delete window.__hudToggle;
      delete window.__dispatchHudUpdate;
    };
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-[4.5rem] right-6 z-[9999] font-mono text-[10px] px-2 py-1 rounded border border-forsythia/30 bg-nocturnal-deep/80 text-forsythia backdrop-blur-sm hover:opacity-80 transition-opacity duration-150"
        aria-label="Show Render Integrity HUD"
      >
        HUD
      </button>
    );
  }

  return (
    <aside
      className="render-hud"
      aria-label="Render Integrity HUD — live render counts per section"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono font-semibold text-forsythia text-[11px] tracking-widest uppercase">
          Render Integrity HUD
        </span>
        <button
          onClick={() => setVisible(false)}
          className="text-arctic-powder/40 hover:text-arctic-powder transition-colors duration-150 ml-2"
          aria-label="Close HUD"
        >
          <XMarkIcon size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="font-mono text-[10px] text-arctic-powder/50 mb-2 uppercase tracking-widest">
        Section · React renders
      </div>

      {(Object.entries(counts) as [keyof Counts, number][]).map(([section, count]) => (
        <div key={section} className="render-hud-row">
          <span className="text-arctic-powder/70">{SECTION_LABELS[section]}</span>
          <span className="render-hud-count">{count}</span>
        </div>
      ))}

      <div className="render-hud-row mt-2 pt-2 border-t border-forsythia/20">
        <span className="text-arctic-powder/70">Price node paints</span>
        <span className="render-hud-paint font-mono font-semibold">+{paints}</span>
      </div>

      <p className="font-sans text-[9px] text-arctic-powder/30 mt-3 leading-relaxed">
        Toggle currency → only price nodes repaint.<br />
        Hero / Features / Footer stay at initial count.
      </p>
    </aside>
  );
}


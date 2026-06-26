'use client';

import { useEffect, useState } from 'react';

export function PerformanceBadge() {
  const [entry, setEntry] = useState<number | null>(null);
  const [tti, setTti] = useState<string>('measuring…');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    /* Measure entry orchestration time */
    const t0 = performance.now();

    const measure = () => {
      const elapsed = Math.round(performance.now() - t0);
      setEntry(elapsed);

      /* Try LCP via PerformanceObserver */
      try {
        const obs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          if (lcp) {
            setTti(`LCP ${Math.round(lcp.startTime)}ms`);
            obs.disconnect();
          }
        });
        obs.observe({ type: 'largest-contentful-paint', buffered: true });
        /* Fallback TTI via navigation timing */
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (nav && nav.domInteractive) {
          setTti(`TTI ${Math.round(nav.domInteractive)}ms`);
        }
      } catch {
        setTti('TTI clean');
      }
    };

    /* Wait for initial paint to settle */
    if (document.readyState === 'complete') {
      requestAnimationFrame(() => requestAnimationFrame(measure));
    } else {
      window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(measure)));
    }

    /* Expose toggle to command palette */
    window.__perfToggle = () => setVisible((v) => !v);
    return () => { delete window.__perfToggle; };
  }, []);

  if (!visible || entry === null) return null;

  const isGreen = entry <= 500;

  return (
    <div
      className="perf-badge"
      style={isGreen ? {} : { borderColor: 'rgba(248,113,113,0.4)', color: '#f87171' }}
      onClick={() => setVisible(false)}
      title="Click to dismiss. Measured from JS execution start."
      role="status"
      aria-label={`Entry orchestration: ${entry}ms. ${tti}. ${isGreen ? 'Passes' : 'Exceeds'} the 500ms threshold.`}
    >
      <span style={{ fontSize: '9px' }}>●</span>
      Entry: {entry}ms {isGreen ? '✓' : '⚠'} · {tti}
    </div>
  );
}

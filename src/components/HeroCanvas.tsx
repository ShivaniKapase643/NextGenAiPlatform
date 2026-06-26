'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  pulse: number;
}

const COLORS = ['#FFC801', 'rgba(74,222,128,0.9)', 'rgba(167,139,250,0.9)', 'rgba(56,189,248,0.8)', 'rgba(241,246,244,0.5)'];

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const nodes: Node[] = [];
    const MAX_DIST = 130;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };

    const initNodes = () => {
      nodes.length = 0;
      const count = prefersReduced ? 0 : Math.min(28, Math.floor((W * H) / 8000));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.5 + Math.random() * 2.5,
          color: COLORS[i % COLORS.length],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    initNodes();

    const handleResize = () => { resize(); initNodes(); };
    window.addEventListener('resize', handleResize, { passive: true });

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      if (!prefersReduced) {
        nodes.forEach((n) => {
          n.x += n.vx; n.y += n.vy; n.pulse += 0.018;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        });
      }

      /* Edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,200,1,${0.14 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      /* Nodes */
      nodes.forEach((n) => {
        const pulse = prefersReduced ? 1 : (Math.sin(n.pulse) * 0.35 + 0.65);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.75 }}
      aria-hidden="true"
    />
  );
}

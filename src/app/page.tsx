'use client';

import { useState, useEffect, useCallback } from 'react';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { SocialProof } from '@/components/SocialProof';
import { Footer } from '@/components/Footer';
import { CommandPalette } from '@/components/CommandPalette';
import { RenderHUD } from '@/components/RenderHUD';
import { PerformanceBadge } from '@/components/PerformanceBadge';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  /* Global keyboard shortcut ⌘K / Ctrl+K */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <Nav onOpenPalette={openPalette} />
      <main id="main-content">
        <Hero />
        <Features />
        <Pricing />
        <SocialProof />
      </main>
      <Footer />
      <ThemeToggle />
      <RenderHUD />
      <PerformanceBadge />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </>
  );
}

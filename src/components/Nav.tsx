'use client';

import { useEffect, useRef, useState } from 'react';
import { SearchIcon, XMarkIcon, LinkSolidIcon } from '@/lib/svgs';

interface NavProps {
  onOpenPalette: () => void;
}

export function Nav({ onOpenPalette }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* C7: Active section highlight via IntersectionObserver */
  useEffect(() => {
    const sectionIds = ['features', 'pricing', 'testimonials', 'faq'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'nav-blur' : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 group"
          aria-label="NextSync AI — home"
        >
          <span className="w-8 h-8 rounded-lg bg-forsythia flex items-center justify-center">
            <LinkSolidIcon size={16} className="text-nocturnal-deep" aria-hidden="true" />
          </span>
          <span className="font-mono font-700 text-lg text-arctic-powder tracking-tight">
            Next<span className="text-forsythia">Sync</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`font-sans text-sm font-medium transition-colors duration-150 ${
                  activeSection === href
                    ? 'text-forsythia'
                    : 'text-arctic-powder/70 hover:text-forsythia'
                }`}
                aria-current={activeSection === href ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-150 font-sans text-xs text-white/50"
            aria-label="Open command palette"
            aria-keyshortcuts="Control+k Meta+k"
          >
            <SearchIcon size={14} aria-hidden="true" />
            <span>Search</span>
            <kbd className="font-mono text-[10px] opacity-50">⌘K</kbd>
          </button>

          <a
            href="#pricing"
            className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
          >
            Get Started
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-arctic-powder/70 hover:text-forsythia transition-colors duration-150"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <XMarkIcon size={20} aria-hidden="true" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden nav-blur border-t border-white/10 px-6 py-4">
          <ul className="flex flex-col gap-1" role="list">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 font-sans text-sm font-medium text-arctic-powder/80 hover:text-forsythia transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href="#pricing" className="btn-primary text-sm w-full justify-center">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

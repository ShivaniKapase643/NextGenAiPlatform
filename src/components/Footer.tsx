'use client';

import { LinkIcon, LinkSolidIcon, ArrowPathIcon } from '@/lib/svgs';

function trackRender(section: string) {
  if (typeof window === 'undefined') return;
  window.__hudCounts = window.__hudCounts ?? {};
  window.__hudCounts[section] = (window.__hudCounts[section] ?? 0) + 1;
  window.__dispatchHudUpdate?.();
}

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
  Developers: ['Docs', 'API Reference', 'SDKs', 'Webhooks', 'CLI'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR', 'Cookie Policy'],
};

const SOCIAL = [
  { label: 'GitHub', href: '#', Icon: LinkSolidIcon },
  { label: 'Twitter / X', href: '#', Icon: LinkIcon },
  { label: 'LinkedIn', href: '#', Icon: LinkIcon },
];

export function Footer() {
  trackRender('footer');

  return (
    <footer
      id="footer"
      role="contentinfo"
      className="border-t border-[var(--border-color)]"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <a
              href="#"
              className="flex items-center gap-2 mb-4"
              aria-label="NextSync AI — home"
            >
              <span className="w-8 h-8 rounded-lg bg-forsythia flex items-center justify-center">
                <LinkSolidIcon size={16} className="text-nocturnal-deep" aria-hidden="true" />
              </span>
              <span className="font-mono font-bold text-lg text-text-primary tracking-tight">
                Next<span className="text-forsythia">Sync</span>
              </span>
            </a>
            <p className="font-sans text-sm text-text-muted leading-relaxed mb-6">
              AI-driven data automation for the next generation of data teams.
              Built for scale. Designed for humans.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-text-muted hover:text-forsythia hover:border-forsythia transition-all duration-150"
                >
                  <Icon size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h3 className="font-mono font-semibold text-xs text-text-muted uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-sans text-sm text-text-secondary hover:text-forsythia transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-text-muted">
            &copy; {new Date().getFullYear()} NextSync AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <ArrowPathIcon size={12} aria-hidden="true" />
            <span>Syncing data in real time, worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


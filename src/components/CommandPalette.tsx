'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SearchIcon, XMarkIcon, ChevronRightIcon, ArrowPathIcon, Cog8ToothIcon, ChartPieIcon } from '@/lib/svgs';
import type { CurrencyKey, BillingCycle } from '@/lib/pricing';

interface PaletteProps {
  open: boolean;
  onClose: () => void;
}

type CommandAction =
  | { type: 'navigate'; href: string }
  | { type: 'currency'; value: CurrencyKey }
  | { type: 'billing'; value: BillingCycle }
  | { type: 'theme'; value: 'dark' | 'light' }
  | { type: 'hud' }
  | { type: 'perf' };

interface Command {
  id: string;
  label: string;
  category: string;
  Icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  shortcut?: string;
  action: CommandAction;
}

const COMMANDS: Command[] = [
  {
    id: 'nav-hero',
    label: 'Go to Hero',
    category: 'Navigate',
    Icon: ChevronRightIcon,
    action: { type: 'navigate', href: '#hero' },
  },
  {
    id: 'nav-features',
    label: 'Go to Features',
    category: 'Navigate',
    Icon: ChevronRightIcon,
    shortcut: 'F',
    action: { type: 'navigate', href: '#features' },
  },
  {
    id: 'nav-pricing',
    label: 'Go to Pricing',
    category: 'Navigate',
    Icon: ChevronRightIcon,
    shortcut: 'P',
    action: { type: 'navigate', href: '#pricing' },
  },
  {
    id: 'nav-testimonials',
    label: 'Go to Testimonials',
    category: 'Navigate',
    Icon: ChevronRightIcon,
    action: { type: 'navigate', href: '#testimonials' },
  },
  {
    id: 'cur-usd',
    label: 'Switch currency to USD ($)',
    category: 'Pricing',
    Icon: ArrowPathIcon,
    action: { type: 'currency', value: 'USD' },
  },
  {
    id: 'cur-inr',
    label: 'Switch currency to INR (₹)',
    category: 'Pricing',
    Icon: ArrowPathIcon,
    action: { type: 'currency', value: 'INR' },
  },
  {
    id: 'cur-eur',
    label: 'Switch currency to EUR (€)',
    category: 'Pricing',
    Icon: ArrowPathIcon,
    action: { type: 'currency', value: 'EUR' },
  },
  {
    id: 'bill-monthly',
    label: 'Billing: Monthly',
    category: 'Pricing',
    Icon: ChartPieIcon,
    action: { type: 'billing', value: 'monthly' },
  },
  {
    id: 'bill-annual',
    label: 'Billing: Annual (save 20%)',
    category: 'Pricing',
    Icon: ChartPieIcon,
    action: { type: 'billing', value: 'annual' },
  },
  {
    id: 'theme-dark',
    label: 'Switch to Dark theme',
    category: 'Display',
    Icon: Cog8ToothIcon,
    action: { type: 'theme', value: 'dark' },
  },
  {
    id: 'theme-light',
    label: 'Switch to Light theme',
    category: 'Display',
    Icon: Cog8ToothIcon,
    action: { type: 'theme', value: 'light' },
  },
  {
    id: 'toggle-hud',
    label: 'Toggle Render Integrity HUD',
    category: 'Display',
    Icon: Cog8ToothIcon,
    shortcut: 'H',
    action: { type: 'hud' },
  },
  {
    id: 'toggle-perf',
    label: 'Toggle Performance Badge',
    category: 'Display',
    Icon: Cog8ToothIcon,
    action: { type: 'perf' },
  },
];

export function CommandPalette({ open, onClose }: PaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  const execute = useCallback((cmd: Command) => {
    onClose();
    setQuery('');

    switch (cmd.action.type) {
      case 'navigate':
        document.querySelector(cmd.action.href)?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'currency':
        window.__pricingSelectCurrency?.(cmd.action.value);
        break;
      case 'billing':
        window.__pricingSelectBilling?.(cmd.action.value);
        break;
      case 'theme':
        document.documentElement.setAttribute('data-theme', cmd.action.value);
        localStorage.setItem('theme', cmd.action.value);
        break;
      case 'hud':
        window.__hudToggle?.();
        break;
      case 'perf':
        window.__perfToggle?.();
        break;
    }
  }, [onClose]);

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    } else {
      setQuery('');
    }
  }, [open]);

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selected]) execute(filtered[selected]);
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  /* Group by category */
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] = acc[cmd.category] ?? []).push(cmd);
    return acc;
  }, {});

  let itemIndex = 0;

  return (
    <div
      className={`cmd-overlay ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cmd-box" onKeyDown={handleKeyDown}>
        {/* Search input */}
        <div className="cmd-input-wrap">
          <SearchIcon size={16} className="text-text-muted flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Search commands…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <button onClick={onClose} aria-label="Close palette" className="text-text-muted hover:text-arctic-powder transition-colors duration-150">
            <XMarkIcon size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Results */}
        <div className="cmd-results" role="listbox" aria-label="Command results">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {category}
              </div>
              {cmds.map((cmd) => {
                const idx = itemIndex++;
                const isSelected = idx === selected;
                return (
                  <button
                    key={cmd.id}
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected}
                    className="cmd-item w-full text-left"
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelected(idx)}
                  >
                    <cmd.Icon size={16} className="cmd-item-icon" aria-hidden="true" />
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="cmd-shortcut">{cmd.shortcut}</kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-8 font-sans text-sm text-text-muted">
              No commands match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


/* Ambient global declarations — shared across all client components.
   Avoids duplicate declare global blocks per file. */

declare global {
  interface Window {
    __hudCounts?: Record<string, number>;
    __hudPaints?: number;
    __dispatchHudUpdate?: () => void;
    __hudToggle?: () => void;
    __perfToggle?: () => void;
    __pricingSelectCurrency?: (c: string) => void;
    __pricingSelectBilling?: (b: string) => void;
  }
}

export {};

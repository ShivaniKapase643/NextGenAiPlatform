/* Single source of truth for all pricing data.
   UI and JSON-LD both read from this object — no drift possible. */

export const PRICING = {
  tiers: {
    starter: {
      base: 19,
      label: 'Starter',
      description: 'Perfect for indie developers and small teams getting started with data automation.',
      cta: 'Start Free Trial',
      features: [
        '5 data pipelines',
        '500K events / month',
        '3 team seats',
        'REST & Webhook connectors',
        'Email support',
        '7-day data retention',
      ],
      highlighted: false,
    },
    pro: {
      base: 49,
      label: 'Pro',
      description: 'For scaling businesses that need advanced analytics and higher throughput.',
      cta: 'Get Started',
      features: [
        'Unlimited pipelines',
        '10M events / month',
        '15 team seats',
        '200+ native connectors',
        'Priority support',
        '90-day data retention',
        'Custom transformations',
        'Advanced analytics',
      ],
      highlighted: true,
    },
    enterprise: {
      base: 99,
      label: 'Enterprise',
      description: 'Full-scale operations with SLA guarantees, SSO, and dedicated infrastructure.',
      cta: 'Contact Sales',
      features: [
        'Unlimited everything',
        'Unlimited events',
        'Unlimited seats',
        'Dedicated infrastructure',
        '24/7 dedicated support',
        'Unlimited data retention',
        'Custom SLA (99.99% uptime)',
        'SSO & SCIM provisioning',
        'On-premise deployment',
      ],
      highlighted: false,
    },
  },
  currency: {
    USD: { symbol: '$', tariff: 1.00, label: 'USD', locale: 'en-US' },
    INR: { symbol: '₹', tariff: 83.0, label: 'INR', locale: 'en-IN' },
    EUR: { symbol: '€', tariff: 0.92, label: 'EUR', locale: 'de-DE' },
  },
  annualDiscount: 0.20,
} as const;

export type CurrencyKey = keyof typeof PRICING.currency;
export type TierKey = keyof typeof PRICING.tiers;
export type BillingCycle = 'monthly' | 'annual';

export function computePrice(
  base: number,
  currency: CurrencyKey,
  billing: BillingCycle
): { amount: string; symbol: string; period: string } {
  const { tariff, symbol } = PRICING.currency[currency];
  const monthly = base * tariff;
  const amount = billing === 'annual'
    ? monthly * (1 - PRICING.annualDiscount)
    : monthly;

  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString();

  return {
    amount: formatted,
    symbol,
    period: billing === 'annual' ? '/mo · billed annually' : '/month',
  };
}

/* Generate schema.org JSON-LD from the pricing matrix */
export function buildPricingJsonLd() {
  const offers = (Object.entries(PRICING.tiers) as [TierKey, typeof PRICING.tiers[TierKey]][]).map(
    ([key, tier]) => {
      const { amount, symbol } = computePrice(tier.base, 'USD', 'monthly');
      return {
        '@type': 'Offer',
        name: tier.label,
        description: tier.description,
        price: PRICING.tiers[key].base.toString(),
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: PRICING.tiers[key].base.toString(),
          priceCurrency: 'USD',
          unitText: 'MONTH',
        },
        url: 'https://nextsync.ai/#pricing',
      };
    }
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'NextSync AI Platform',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'AI-driven data automation platform with real-time sync, predictive analytics, and intelligent workflow orchestration.',
        url: 'https://nextsync.ai',
        offers,
      },
      {
        '@type': 'Organization',
        name: 'NextSync AI',
        url: 'https://nextsync.ai',
        logo: 'https://nextsync.ai/logo.png',
        sameAs: [
          'https://twitter.com/nextsyncai',
          'https://linkedin.com/company/nextsyncai',
          'https://github.com/nextsyncai',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nextsync.ai' },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://nextsync.ai/#pricing' },
          { '@type': 'ListItem', position: 3, name: 'Features', item: 'https://nextsync.ai/#features' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I change plans at any time?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Upgrades apply immediately, downgrades take effect at the next billing cycle.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is there a free trial?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every plan includes a 14-day free trial with no credit card required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer discounts for annual billing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes — annual billing gives you a flat 20% discount across all tiers.',
            },
          },
        ],
      },
    ],
  };
}

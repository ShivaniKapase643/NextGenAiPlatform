import type { Metadata } from 'next';
import { JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { buildPricingJsonLd } from '@/lib/pricing';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const BASE_URL = 'https://nextsync.ai';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'NextSync AI — AI-Driven Data Automation Platform',
  description:
    'NextSync AI connects every data source, transforms streams in real time, and delivers predictive insights with zero infrastructure overhead and millisecond latency.',
  keywords: [
    'data automation', 'AI platform', 'real-time sync', 'data pipeline',
    'predictive analytics', 'workflow automation', 'API integration',
  ],
  authors: [{ name: 'NextSync AI', url: BASE_URL }],
  creator: 'NextSync AI',
  publisher: 'NextSync AI, Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'NextSync AI',
    title: 'NextSync AI — AI-Driven Data Automation Platform',
    description:
      'Automate your data universe in real time. NextSync AI delivers sub-millisecond sync, predictive analytics, and intelligent workflow orchestration.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NextSync AI — AI-Driven Data Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextSync AI — AI-Driven Data Automation Platform',
    description:
      'Sub-millisecond data sync. Predictive AI. Intelligent workflows. Build on NextSync.',
    images: ['/og-image.png'],
    creator: '@nextsyncai',
    site: '@nextsyncai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildPricingJsonLd();

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${jetbrainsMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD structured data — generated from the live pricing matrix */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Inline theme init to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t||p);}())`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

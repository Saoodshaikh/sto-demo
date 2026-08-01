import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://selecttalent.co'),
  title: 'Select Talent Co — The Operating System for the Global Talent Economy',
  description:
    'STC is India’s AI-powered Talent Discovery, Artist Management and Talent Commerce platform. We connect talent with brands, recruiters, agencies and opportunities through intelligence.',
  keywords: [
    'AI talent platform',
    'talent discovery',
    'artist management',
    'talent commerce',
    'India AI',
    'Select Talent Co',
  ],
  openGraph: {
    title: 'Select Talent Co',
    description: 'The operating system for the global talent economy.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#04060d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="grain font-sans antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import './globals.css';

export const metadata: Metadata = {
  title: 'WAHS 2026 — World Congress for Hallyu Studies',
  description: 'Cultural Dynamism in the Digital Age — Toward a Universal Theory of Pop Culture Globalization. May 28–30, 2026, Jeju Island, South Korea.',
  openGraph: {
    title: 'WAHS 2026 — World Congress for Hallyu Studies',
    description: 'Cultural Dynamism in the Digital Age — May 28–30, 2026, Jeju Island',
    url: 'https://congress.iwahs.org/2026',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

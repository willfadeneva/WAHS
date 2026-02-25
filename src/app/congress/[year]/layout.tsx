import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WAHS — World Association for Hallyu Studies',
};

export default function YearLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

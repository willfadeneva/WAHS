'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  '': 'Home',
  '2026': '2026 Congress',
  'submissions': 'Call for Papers',
  'registration': 'Registration',
  'history': 'History',
  'board-members': 'Board Members',
  'about': 'About',
  'membership': 'Membership',
  'admin': 'Admin',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Home', href: '/' }];

  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ label: LABELS[seg] || seg, href: path });
  }

  return (
    <nav aria-label="Breadcrumb" style={{
      padding: '8px 24px',
      fontSize: '13px',
      color: '#888',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 50,
    }}>
      {crumbs.map((c, i) => (
        <span key={c.href}>
          {i > 0 && <span style={{ margin: '0 8px', color: '#ccc' }}>/</span>}
          {i === crumbs.length - 1 ? (
            <span style={{ color: '#000', fontWeight: 500 }}>{c.label}</span>
          ) : (
            <Link href={c.href} style={{ color: '#666', textDecoration: 'none' }}>{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

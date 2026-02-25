import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      textAlign: 'center',
      padding: '40px',
      fontFamily: 'inherit',
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 700, color: '#0047A0', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#1a1a2e', margin: '16px 0 8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#666', fontSize: '1rem', marginBottom: 32, maxWidth: 400 }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '12px 28px', background: '#0047A0', color: '#fff',
          borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
        }}>
          Go Home
        </Link>
        <Link href="/congress/2026" style={{
          padding: '12px 28px', border: '1px solid #0047A0', color: '#0047A0',
          borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
        }}>
          2026 Congress
        </Link>
      </div>
    </div>
  );
}

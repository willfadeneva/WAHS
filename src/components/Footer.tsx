import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', color: 'rgba(255,255,255,0.75)', padding: '48px 40px 28px', fontSize: '0.88rem', lineHeight: 1.8 }}>

      {/* Two-column: Contact Info + Address */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingBottom: 32 }}>

        {/* Contact Information */}
        <div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: '#c0392b', marginBottom: 16, fontWeight: 600 }}>
            Contact Information
          </h3>
          <p style={{ margin: 0 }}><strong style={{ color: 'rgba(255,255,255,0.9)' }}>Tel.</strong> +82 (0)2 971 – 5577</p>
          <p style={{ margin: 0 }}><strong style={{ color: 'rgba(255,255,255,0.9)' }}>Fax.</strong> +82 (0)2 6455 – 2578</p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Email:</strong>{' '}
            <a href="mailto:wahskorea@gmail.com" style={{ color: '#c0392b', textDecoration: 'none', borderBottom: 'none' }}>
              wahskorea@gmail.com
            </a>
          </p>
        </div>

        {/* Address */}
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: '#c0392b', marginBottom: 16, fontWeight: 600 }}>
            Address
          </h3>
          <p style={{ margin: 0 }}>C-dong 204-ho Diwoo Artville</p>
          <p style={{ margin: 0 }}>353-10 Eungam-dong, Eunpyeong-gu</p>
          <p style={{ margin: 0 }}>Seoul, South Korea</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 900, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', fontWeight: 600 }}>WAHS | 세계한류학회</p>
        <p style={{ margin: '2px 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
          designed by{' '}
          <a href="https://wa.me/818042615062" target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline', fontWeight: 700 }}>
            CJ
          </a>
        </p>
        <p style={{ margin: '2px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>© 2026 WAHS. All rights reserved.</p>
        <p style={{ margin: '10px 0 0', fontSize: '0.7rem' }}>
          <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.18)', textDecoration: 'none', borderBottom: 'none' }}>Admin</Link>
        </p>
      </div>

    </footer>
  );
}

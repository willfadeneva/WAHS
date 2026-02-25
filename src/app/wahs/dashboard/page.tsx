import { redirect } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { createServerClient } from '@/lib/supabase-server';

const PAYPAL_LINKS: Record<string, string> = {
  professional: process.env.NEXT_PUBLIC_PAYPAL_WAHS_PROFESSIONAL || 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  student: process.env.NEXT_PUBLIC_PAYPAL_WAHS_STUDENT || 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    active: { bg: '#d1fae5', color: '#065f46' },
    expired: { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      padding: '4px 14px',
      borderRadius: 20,
      fontSize: '0.82rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      background: s.bg,
      color: s.color,
    }}>
      {status}
    </span>
  );
}

export default async function WAHSDashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/wahs/login');
  }

  const { data: member } = await supabase
    .from('wahs_members')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!member) {
    redirect('/wahs/login');
  }

  const expiresDate = member.expires_at ? new Date(member.expires_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : 'N/A';

  const isPending = member.membership_status === 'pending';
  const isActive = member.membership_status === 'active';
  const paypalUrl = PAYPAL_LINKS[member.membership_type] || PAYPAL_LINKS.professional;

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">My Dashboard</h1>
            <p className="main-page-subtitle">Welcome back, {member.full_name}</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
            {/* Membership Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
              <div className="main-content-box">
                <h3>Membership Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <StatusBadge status={member.membership_status} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--mist)', textTransform: 'capitalize' }}>
                    {member.membership_type} Member
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mist)' }}>Type</span>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{member.membership_type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mist)' }}>Email</span>
                    <span style={{ fontWeight: 600 }}>{member.email}</span>
                  </div>
                  {member.institution && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--mist)' }}>Institution</span>
                      <span style={{ fontWeight: 600 }}>{member.institution}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mist)' }}>Expires</span>
                    <span style={{ fontWeight: 600 }}>{expiresDate}</span>
                  </div>
                </div>
              </div>

              {/* Payment Reminder for Pending */}
              {isPending && (
                <div className="main-content-box" style={{ borderLeft: '4px solid var(--kr-red)' }}>
                  <h3 style={{ color: 'var(--kr-red)' }}>⚠️ Payment Required</h3>
                  <p style={{ color: 'var(--slate)', marginBottom: 20, fontSize: '0.92rem' }}>
                    Your membership application is pending payment. Please complete your payment via PayPal
                    to activate your WAHS membership.
                  </p>
                  <a
                    href={paypalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-paypal"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    Complete Payment ({member.membership_type === 'professional' ? '$250' : '$150'})
                  </a>
                  <p style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--mist)' }}>
                    After payment, your membership will be activated within 1–2 business days.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: 16 }}>
              Quick Links
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <Link href="/wahs/profile" style={{ textDecoration: 'none' }}>
                <div className="main-content-box" style={{ textAlign: 'center', padding: '24px 16px', transition: 'transform 0.2s', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>👤</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>My Profile</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 4 }}>Update your information</div>
                </div>
              </Link>
              {isActive && (
                <Link href="/wahs/members" style={{ textDecoration: 'none' }}>
                  <div className="main-content-box" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌐</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Member Directory</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 4 }}>Connect with members</div>
                  </div>
                </Link>
              )}
              {isActive && (
                <Link href="/wahs/resources" style={{ textDecoration: 'none' }}>
                  <div className="main-content-box" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📚</div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Resources</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 4 }}>Member-only content</div>
                  </div>
                </Link>
              )}
              <Link href="/congress/2026/registration" style={{ textDecoration: 'none' }}>
                <div className="main-content-box" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎟️</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Congress 2026</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 4 }}>Register for the congress</div>
                </div>
              </Link>
              <Link href="/congress/2026/submit-abstract" style={{ textDecoration: 'none' }}>
                <div className="main-content-box" style={{ textAlign: 'center', padding: '24px 16px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Submit Abstract</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 4 }}>Congress 2026</div>
                </div>
              </Link>
            </div>

            {/* Congress Registration note for WAHS members */}
            {isActive && (
              <div className="main-content-box" style={{ background: 'rgba(0,71,160,0.04)', borderLeft: '4px solid var(--kr-blue)' }}>
                <h3>Congress 2026 — Free Registration for Members</h3>
                <p style={{ color: 'var(--slate)', fontSize: '0.92rem', marginBottom: 16 }}>
                  As a WAHS {member.membership_type} member, you qualify for free congress registration.
                  Log in to the congress portal to register.
                </p>
                <Link href="/congress/2026/dashboard" className="btn-primary" style={{ display: 'inline-flex' }}>
                  Go to Congress Portal →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

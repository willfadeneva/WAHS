import { redirect } from 'next/navigation';
import Link from 'next/link';
import CongressNav from '@/components/CongressNav';
import MainFooter from '@/components/MainFooter';
import { createServerClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase';
import LogoutButton from './LogoutButton';

export const dynamic = 'force-dynamic';

type Submission = {
  id: string;
  title: string;
  presentation_type: string;
  track: string;
  status: string;
  submitted_at: string;
};

type Registration = {
  id: string;
  ticket_type: string;
  amount_paid: number;
  registered_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    under_review: { bg: '#dbeafe', color: '#1e40af' },
    accepted: { bg: '#d1fae5', color: '#065f46' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    withdrawn: { bg: '#f3f4f6', color: '#6b7280' },
  };
  const s = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      padding: '3px 12px',
      borderRadius: 20,
      fontSize: '0.78rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      background: s.bg,
      color: s.color,
    }}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function TicketBadge({ type }: { type: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    regular: { bg: '#dbeafe', color: '#1e40af' },
    student: { bg: '#d1fae5', color: '#065f46' },
    wahs_member: { bg: '#fef3c7', color: '#92400e' },
  };
  const s = styles[type] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      padding: '3px 12px',
      borderRadius: 20,
      fontSize: '0.78rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      background: s.bg,
      color: s.color,
    }}>
      {type.replace(/_/g, ' ')}
    </span>
  );
}

export default async function CongressDashboardPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  // Get the logged-in user via session-aware server client
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/congress/${year}/login`);
  }

  // Use admin client to bypass RLS for data fetches
  const db = createAdminClient();

  const [subResult, regResult, memberResult] = await Promise.all([
    db
      .from('submissions')
      .select('id, title, presentation_type, track, status, submitted_at')
      .eq('user_id', user.id)
      .eq('congress_year', year)
      .order('submitted_at', { ascending: false }),
    db
      .from('congress_registrations')
      .select('id, ticket_type, amount_paid, registered_at')
      .eq('user_id', user.id)
      .eq('congress_year', year)
      .maybeSingle(),
    db
      .from('wahs_members')
      .select('full_name, membership_status, membership_type')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const submissions = (subResult.data || []) as Submission[];
  const registration = regResult.data as Registration | null;
  const wahsMember = memberResult.data;

  const displayName = wahsMember?.full_name || user.email;

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 className="main-page-title">My Congress {year}</h1>
              <p className="main-page-subtitle">Welcome back, {displayName}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <Link
                href={`/congress/${year}`}
                style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 6, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                ← Back to Congress
              </Link>
              <LogoutButton />
            </div>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
            {/* No registration banner */}
            {!registration && (
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ color: '#92400e' }}>
                  <strong>You haven&apos;t registered yet</strong>
                  <span style={{ marginLeft: 8, fontSize: '0.9rem' }}>Complete your registration to attend Congress {year}.</span>
                </div>
                <Link
                  href={`/congress/${year}/registration`}
                  style={{ padding: '8px 18px', background: '#f59e0b', color: '#fff', borderRadius: 6, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
                >
                  Register Now →
                </Link>
              </div>
            )}

            {/* Congress Registration Status */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: 16 }}>
                Congress Registration
              </h2>
              {registration ? (
                <div className="main-content-box" style={{ borderLeft: '4px solid #065f46' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        Registered
                        <TicketBadge type={registration.ticket_type} />
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--slate)' }}>
                        {registration.amount_paid > 0 ? `$${registration.amount_paid} paid` : 'Free registration'}
                        {' · '}Registered {new Date(registration.registered_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="main-content-box" style={{ borderLeft: '4px solid var(--kr-red)' }}>
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ color: 'var(--navy)' }}>Not yet registered for Congress {year}</strong>
                    {wahsMember?.membership_status === 'active' && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginTop: 4 }}>
                        As a WAHS member, you qualify for free or discounted registration.
                      </p>
                    )}
                  </div>
                  <Link href={`/congress/${year}/registration`} className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                    Register for Congress →
                  </Link>
                </div>
              )}
            </div>

            {/* Submissions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', margin: 0 }}>
                My Submissions ({submissions.length})
              </h2>
              <Link href={`/congress/${year}/submit-abstract`} className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                + Submit Abstract
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="main-content-box" style={{ textAlign: 'center', padding: '48px 40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--navy)', marginBottom: 8 }}>No Submissions Yet</h3>
                <p style={{ color: 'var(--slate)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                  Submit your abstract for Congress {year}. The deadline is May 15, 2026.
                </p>
                <Link href={`/congress/${year}/submit-abstract`} className="btn-primary" style={{ display: 'inline-flex' }}>
                  Submit Your Abstract →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {submissions.map(sub => (
                  <div key={sub.id} className="main-content-box">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>
                            {sub.title}
                          </h3>
                          <StatusBadge status={sub.status} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
                          {sub.presentation_type?.replace(/_/g, ' ')} · {sub.track}
                          {' · '}Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {sub.status !== 'withdrawn' && sub.status !== 'accepted' && (
                          <Link
                            href={`/congress/${year}/submissions/${sub.id}/edit`}
                            style={{
                              padding: '6px 16px',
                              background: 'var(--kr-blue)',
                              color: '#fff',
                              borderRadius: 4,
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            Edit
                          </Link>
                        )}
                        {sub.status === 'accepted' && (
                          <span style={{ padding: '6px 16px', background: '#d1fae5', color: '#065f46', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}>
                            Accepted ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

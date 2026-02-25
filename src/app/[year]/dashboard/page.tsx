import { redirect } from 'next/navigation';
import Link from 'next/link';
import CongressNav from '@/components/CongressNav';
import MainFooter from '@/components/MainFooter';
import { createServerClient } from '@/lib/supabase-server';

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
      {status.replace('_', ' ')}
    </span>
  );
}

export default async function CongressDashboardPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${year}/login`);
  }

  // Fetch submissions for this user and year
  const { data: submissions } = await supabase
    .from('submissions')
    .select('id, title, presentation_type, track, status, submitted_at')
    .eq('user_id', user.id)
    .eq('congress_year', year)
    .order('submitted_at', { ascending: false });

  // Fetch congress registration
  const { data: registration } = await supabase
    .from('congress_registrations')
    .select('id, ticket_type, amount_paid, registered_at')
    .eq('user_id', user.id)
    .eq('congress_year', year)
    .single();

  // Check if WAHS member
  const { data: wahsMember } = await supabase
    .from('wahs_members')
    .select('full_name, membership_status, membership_type')
    .eq('user_id', user.id)
    .single();

  const displayName = wahsMember?.full_name || user.email;

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Congress {year}</h1>
            <p className="main-page-subtitle">Welcome back, {displayName}</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
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
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Registered</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--slate)' }}>
                        {(registration as Registration).ticket_type?.replace('_', ' ')} ticket
                        {(registration as Registration).amount_paid > 0 && ` — $${(registration as Registration).amount_paid}`}
                        {' · '}Registered {new Date((registration as Registration).registered_at).toLocaleDateString()}
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
                  <Link href={`/${year}/registration`} className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                    Register for Congress →
                  </Link>
                </div>
              )}
            </div>

            {/* Submissions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', margin: 0 }}>
                My Submissions ({submissions?.length || 0})
              </h2>
              <Link href={`/${year}/submit-abstract`} className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.9rem' }}>
                + Submit New Abstract
              </Link>
            </div>

            {(!submissions || submissions.length === 0) ? (
              <div className="main-content-box" style={{ textAlign: 'center', padding: '48px 40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--navy)', marginBottom: 8 }}>No Submissions Yet</h3>
                <p style={{ color: 'var(--slate)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                  Submit your abstract for Congress {year}. The deadline is May 15, 2026.
                </p>
                <Link href={`/${year}/submit-abstract`} className="btn-primary" style={{ display: 'inline-flex' }}>
                  Submit Your Abstract →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(submissions as Submission[]).map(sub => (
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
                            href={`/${year}/submissions/${sub.id}/edit`}
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

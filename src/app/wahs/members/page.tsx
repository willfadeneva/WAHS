import { redirect } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { createServerClient } from '@/lib/supabase-server';

export default async function MembersDirectoryPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/wahs/login');
  }

  // Verify the current user is an active member
  const { data: currentMember } = await supabase
    .from('wahs_members')
    .select('membership_status')
    .eq('user_id', user.id)
    .single();

  if (!currentMember || currentMember.membership_status !== 'active') {
    redirect('/wahs/dashboard');
  }

  // Fetch all active members
  const { data: members } = await supabase
    .from('wahs_members')
    .select('full_name, institution, country, membership_type')
    .eq('membership_status', 'active')
    .order('full_name', { ascending: true });

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Member Directory</h1>
            <p className="main-page-subtitle">
              Connect with {members?.length || 0} active WAHS members worldwide
            </p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
            <div style={{ marginBottom: 20 }}>
              <Link href="/wahs/dashboard" style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
            </div>

            {(!members || members.length === 0) ? (
              <div className="main-content-box" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <p style={{ color: 'var(--mist)' }}>No active members found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid var(--pearl)' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--pearl)' }}>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mist)' }}>Name</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mist)' }}>Institution</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mist)' }}>Country</th>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mist)' }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--navy)' }}>{m.full_name}</td>
                        <td style={{ padding: '12px 20px', color: 'var(--slate)' }}>{m.institution || '—'}</td>
                        <td style={{ padding: '12px 20px', color: 'var(--slate)' }}>{m.country || '—'}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: m.membership_type === 'professional' ? 'rgba(0,71,160,0.1)' : 'rgba(205,46,58,0.1)',
                            color: m.membership_type === 'professional' ? 'var(--kr-blue)' : 'var(--kr-red)',
                            textTransform: 'capitalize' as const,
                          }}>
                            {m.membership_type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

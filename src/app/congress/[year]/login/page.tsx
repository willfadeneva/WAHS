'use client';
import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CongressNav from '@/components/CongressNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

export default function CongressLoginPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const email = (form.get('email') as string).toLowerCase();
    const password = form.get('password') as string;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check WAHS membership dues status
    if (authData.user) {
      const { data: member } = await supabase
        .from('wahs_members')
        .select('membership_status, dues_paid_until')
        .eq('user_id', authData.user.id)
        .single();

      if (member) {
        // Is a WAHS member — check if dues are current
        const duesPending =
          member.membership_status === 'pending_payment' ||
          member.membership_status === 'suspended' ||
          (member.dues_paid_until && new Date(member.dues_paid_until) < new Date());

        if (duesPending) {
          // Sign them out and redirect to pay dues
          await supabase.auth.signOut();
          router.push(`/wahs/login?dues_pending=1&redirect=/${year}/dashboard`);
          return;
        }
      }
    }

    router.push(`/congress/${year}/dashboard`);
  }

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Congress {year}</h1>
            <p className="main-page-subtitle">Sign in to access your submission portal</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="main-content-box">
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: 8 }}>
                Sign In
              </h2>
              <p style={{ color: 'var(--slate)', marginBottom: 24, fontSize: '0.92rem' }}>
                Don&apos;t have an account?{' '}
                <Link href={`/congress/${year}/register`} style={{ color: 'var(--kr-blue)' }}>
                  Create one for free →
                </Link>
              </p>
              <p style={{ color: 'var(--slate)', marginBottom: 24, fontSize: '0.88rem', background: '#f8f8f8', padding: '10px 14px', borderRadius: 6 }}>
                💡 <strong>WAHS members:</strong> use your WAHS email &amp; password. Members with current dues attend Congress for free.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input type="email" name="email" className="form-input" required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password <span className="required">*</span></label>
                  <input type="password" name="password" className="form-input" required autoComplete="current-password" />
                </div>
                {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Link href="/wahs/forgot-password" style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

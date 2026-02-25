'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

export default function WAHSLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duesPending, setDuesPending] = useState(false);
  const [redirect, setRedirect] = useState('/wahs/dashboard');

  useEffect(() => {
    if (searchParams.get('dues_pending') === '1') setDuesPending(true);
    const dest = searchParams.get('redirect');
    if (dest) setRedirect(dest);
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Member Login</h1>
            <p className="main-page-subtitle">Access your WAHS membership dashboard</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 480, margin: '0 auto' }}>
            {duesPending && (
              <div style={{
                marginBottom: 24,
                padding: '16px 20px',
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: 8,
              }}>
                <strong style={{ color: '#92400e', display: 'block', marginBottom: 6 }}>
                  ⚠️ Membership Dues Pending
                </strong>
                <p style={{ fontSize: '0.9rem', color: '#92400e', margin: 0 }}>
                  Your WAHS membership dues are pending. Please log in below to pay your dues
                  and unlock your free Congress registration.
                </p>
              </div>
            )}

            <div className="main-content-box">
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
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <Link href="/wahs/forgot-password" style={{ color: 'var(--kr-blue)' }}>Forgot password?</Link>
                <Link href="/wahs/register" style={{ color: 'var(--kr-blue)' }}>Not a member? Join →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

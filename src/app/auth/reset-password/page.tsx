'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;
    const confirm = form.get('confirm') as string;

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/wahs/dashboard'), 2000);
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Reset Password</h1>
            <p className="main-page-subtitle">Choose a new password for your account</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="main-content-box">
              {success ? (
                <div className="form-success">
                  <div className="form-success-icon">✅</div>
                  <h3>Password Updated!</h3>
                  <p>Your password has been reset successfully. Redirecting to your dashboard…</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">New Password <span className="required">*</span></label>
                    <input
                      type="password"
                      name="password"
                      className="form-input"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <p className="form-help">Minimum 8 characters</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input
                      type="password"
                      name="confirm"
                      className="form-input"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Updating…' : 'Update Password'}
                  </button>
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Link href="/wahs/login" style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>← Back to Login</Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

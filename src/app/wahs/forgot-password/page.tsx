'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Forgot Password</h1>
            <p className="main-page-subtitle">We&apos;ll send you a link to reset your password</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className="main-content-box">
              {sent ? (
                <div className="form-success">
                  <div className="form-success-icon">✉️</div>
                  <h3>Check Your Email</h3>
                  <p>
                    If an account exists with that email, you&apos;ll receive a password reset link shortly.
                    Please check your spam folder if you don&apos;t see it.
                  </p>
                  <div style={{ marginTop: 24 }}>
                    <Link href="/wahs/login" style={{ color: 'var(--kr-blue)' }}>← Back to Login</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input type="email" name="email" className="form-input" required autoComplete="email" />
                    <p className="form-help">Enter the email address associated with your WAHS account.</p>
                  </div>
                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Sending…' : 'Send Reset Link'}
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

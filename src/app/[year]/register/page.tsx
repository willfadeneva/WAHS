'use client';
import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CongressNav from '@/components/CongressNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

export default function CongressRegisterPage() {
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

    const body = {
      full_name: form.get('full_name') as string,
      email: (form.get('email') as string).toLowerCase(),
      password,
      institution: form.get('institution') as string,
    };

    try {
      const res = await fetch(`/api/${year}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      // Sign in via browser client to get a session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push(`/${year}/dashboard`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Congress {year}</h1>
            <p className="main-page-subtitle">Create an account to submit your abstract</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 540, margin: '0 auto' }}>
            <div className="main-content-box">
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: 8 }}>
                Create Account
              </h2>
              <p style={{ color: 'var(--slate)', marginBottom: 24, fontSize: '0.92rem' }}>
                Already have an account?{' '}
                <Link href={`/${year}/login`} style={{ color: 'var(--kr-blue)' }}>
                  Sign in →
                </Link>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input type="text" name="full_name" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input type="email" name="email" className="form-input" required autoComplete="email" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input type="password" name="password" className="form-input" required minLength={8} autoComplete="new-password" />
                    <p className="form-help">Min. 8 characters</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input type="password" name="confirm" className="form-input" required minLength={8} autoComplete="new-password" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Institution / Affiliation</label>
                  <input type="text" name="institution" className="form-input" placeholder="University or organization" />
                </div>
                {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Creating Account…' : 'Create Account →'}
                </button>
              </form>
              <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--mist)', textAlign: 'center' }}>
                Already a WAHS member? Use the same email &amp; password to sign in.
              </p>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

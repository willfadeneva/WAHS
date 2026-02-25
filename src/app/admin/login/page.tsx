'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [usePassword, setUsePassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const email = (form.get('email') as string).toLowerCase().trim();
    const password = form.get('password') as string;

    if (!ADMIN_EMAILS.includes(email)) {
      setError('Access denied. This email is not registered as an admin.');
      setLoading(false);
      return;
    }

    if (usePassword) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      window.location.href = '/admin';
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setSentEmail(email);
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontSize: '0.88rem', fontWeight: 500, padding: 0 }}>
            ← Back
          </button>
          <Link href="/" style={{ color: 'var(--slate)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' }}>
            Home →
          </Link>
        </div>

        <h2>WAHS Admin</h2>
        <p>{usePassword ? 'Sign in with your admin credentials.' : 'Enter your admin email to receive a magic link.'}</p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>✉️</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', marginBottom: 8, color: 'var(--navy)' }}>Check Your Email</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate)', lineHeight: 1.6 }}>
              A magic link has been sent to <strong>{sentEmail}</strong>. Click the link to access the admin dashboard.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--mist)', marginTop: 12 }}>The link expires in 1 hour. Check your spam folder if you don&apos;t see it.</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: 20, fontSize: '0.88rem', color: 'var(--kr-blue)', textDecoration: 'none', fontWeight: 500 }}>
              ← Return to Home
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input type="email" name="email" className="form-input" required autoComplete="email" placeholder="admin@example.com" />
              </div>
              {usePassword && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" required autoComplete="current-password" placeholder="••••••••" />
                </div>
              )}
              {error && (
                <div style={{ marginBottom: 16 }}>
                  <p className="form-error" style={{ marginBottom: 8 }}>{error}</p>
                </div>
              )}
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Signing in…' : usePassword ? 'Sign In' : 'Send Magic Link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.83rem', color: 'var(--mist)' }}>
              <button onClick={() => { setUsePassword(!usePassword); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--kr-blue)', fontWeight: 500, fontSize: '0.83rem', padding: 0 }}>
                {usePassword ? 'Use magic link instead' : 'Sign in with password instead'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

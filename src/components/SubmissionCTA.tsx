'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function SubmissionCTA({ year }: { year: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <div style={{
        maxWidth: 600,
        margin: '48px auto 0',
        padding: '36px 40px',
        background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 100%)',
        border: '2px solid #0047A0',
        borderRadius: 12,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#0047A0', marginBottom: 8 }}>
          Ready to Submit?
        </h3>
        <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: 24 }}>
          You&apos;re signed in. Submit your abstract directly from your dashboard.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={`/congress/${year}/submit-abstract`}
            className="btn-primary"
            style={{ display: 'inline-flex', fontSize: '1rem', padding: '12px 28px' }}
          >
            Submit Abstract →
          </Link>
          <Link
            href={`/congress/${year}/dashboard`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.95rem',
              padding: '12px 24px',
              border: '1px solid #0047A0',
              color: '#0047A0',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Not logged in — show login-to-submit prompt
  return (
    <div style={{
      maxWidth: 600,
      margin: '48px auto 0',
      padding: '36px 40px',
      background: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔐</div>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#1a1a2e', marginBottom: 8 }}>
        Login to Submit
      </h3>
      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: 8 }}>
        To submit an abstract, please sign in to your Congress {year} account.
      </p>
      <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 28 }}>
        Don&apos;t have an account? You can create one for free — no WAHS membership required.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href={`/congress/${year}/login`}
          className="btn-primary"
          style={{ display: 'inline-flex', fontSize: '1rem', padding: '12px 28px' }}
        >
          Sign In to Submit →
        </Link>
        <Link
          href={`/congress/${year}/register`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.95rem',
            padding: '12px 24px',
            border: '1px solid #999',
            color: '#333',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Create Free Account
        </Link>
      </div>
      <p style={{ marginTop: 20, fontSize: '0.82rem', color: '#aaa' }}>
        Already a WAHS member? Use your WAHS login credentials.
      </p>
    </div>
  );
}

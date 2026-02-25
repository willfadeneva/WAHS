'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  year: number;
  memberName: string;
  memberType: string;
  memberEmail: string;
};

export default function WAHSMemberRegistration({ year, memberName, memberType, memberEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  async function handleFreeRegister() {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication error. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('congress_registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('congress_year', year)
        .single();

      if (existing) {
        setRegistered(true);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('congress_registrations')
        .insert({
          congress_year: year,
          user_id: user.id,
          email: memberEmail,
          full_name: memberName,
          ticket_type: 'wahs_member',
          amount_paid: 0,
          is_wahs_member: true,
          registered_at: new Date().toISOString(),
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        setRegistered(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, #0047A0 0%, #003580 100%)', padding: '48px 40px', color: '#fff' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        {registered ? (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 12 }}>
              You&apos;re Registered!
            </h2>
            <p style={{ opacity: 0.9, fontSize: '1rem', lineHeight: 1.6 }}>
              Your complimentary WAHS member registration for Congress {year} has been confirmed.
              A confirmation has been noted. See you in Jeju!
            </p>
          </>
        ) : (
          <>
            <div style={{ display: 'inline-block', padding: '4px 16px', background: 'rgba(205,46,58,0.3)', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
              WAHS Member Exclusive
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 12 }}>
              Free Registration for {memberType === 'professional' ? 'Professional' : 'Student'} Members
            </h2>
            <p style={{ opacity: 0.85, marginBottom: 8 }}>
              Welcome, <strong>{memberName}</strong>! As an active WAHS {memberType} member,
              you qualify for complimentary Congress {year} registration.
            </p>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: 28 }}>
              No payment required — click below to register instantly.
            </p>
            {error && (
              <p style={{ background: 'rgba(205,46,58,0.3)', padding: '8px 16px', borderRadius: 4, marginBottom: 16, fontSize: '0.9rem' }}>
                {error}
              </p>
            )}
            <button
              onClick={handleFreeRegister}
              disabled={loading}
              style={{
                padding: '16px 40px',
                background: 'white',
                color: '#0047A0',
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Registering…' : 'Register for Free →'}
            </button>
            <p style={{ marginTop: 16, opacity: 0.6, fontSize: '0.82rem' }}>
              Non-members can register below at standard rates.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

type Pricing = { tier: string; amount: string; early_bird: string; features: string[]; featured: boolean };

const PayPalIcon = () => (
  <svg className="paypal-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.23A.774.774 0 0 1 5.708 1.6h6.727c2.23 0 3.88.462 4.907 1.374.966.857 1.393 2.133 1.27 3.792-.015.2-.043.407-.078.618a7.153 7.153 0 0 1-.11.56l-.04.18v.16l.122.074a3.548 3.548 0 0 1 .724.584c.388.436.644.97.753 1.564.113.612.084 1.34-.084 2.162-.193.95-.506 1.777-.93 2.46a5.252 5.252 0 0 1-1.47 1.6 5.947 5.947 0 0 1-1.97.908 9.14 9.14 0 0 1-2.435.295H12.57a.95.95 0 0 0-.94.805l-.04.2-.63 3.994-.03.147a.95.95 0 0 1-.938.805H7.076z"/>
  </svg>
);

const EARLY_BIRD_DEADLINE = new Date('2026-05-15T23:59:59+09:00');
const EARLY_BIRD_LABEL = 'May 15, 2026';

function parseAmount(s: string): number {
  const m = s.match(/\$(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function isEarlyBird(): boolean {
  return new Date() <= EARLY_BIRD_DEADLINE;
}

const PAYPAL_LINKS: Record<string, Record<string, string>> = {
  'Regular': {
    early: 'https://www.paypal.com/ncp/payment/5HCS2HYEPSTSG',
    full: 'https://www.paypal.com/ncp/payment/GWYKZDB2TBXRC',
  },
  'Student': {
    early: 'https://www.paypal.com/ncp/payment/69333BMBXNTUE',
    full: 'https://www.paypal.com/ncp/payment/FCVG73FR3RELG',
  },
};

function getPayPalLink(tier: string, earlyBird: boolean): string {
  const links = PAYPAL_LINKS[tier];
  if (links) return earlyBird ? links.early : links.full;
  return `mailto:wahskorea@gmail.com?subject=WAHS%202026%20Registration%20-%20${encodeURIComponent(tier)}`;
}

// Dual pricing card — always shows both prices; strikethrough on the inactive one
function PricingCard({ p, earlyBird, onSelect }: { p: Pricing; earlyBird: boolean; onSelect?: (tier: string) => void }) {
  const fullPrice = parseAmount(p.amount);
  const earlyPrice = parseAmount(p.early_bird);
  const isFree = p.amount === 'Free' || p.amount === '$0';
  const isWahs = p.tier === 'WAHS Member';

  return (
    <div className={`pricing-card${p.featured ? ' featured' : ''}`} style={{ position: 'relative' }}>
      {p.featured && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#0047A0', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Most Popular
        </div>
      )}

      <div className="pricing-tier">{p.tier}</div>

      {isFree || isWahs ? (
        <div className="pricing-amount" style={{ color: '#059669' }}>Free</div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          {/* Early bird price row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.8rem', background: earlyBird ? '#fef3c7' : 'transparent', color: earlyBird ? '#92400e' : '#bbb', padding: '2px 8px', borderRadius: 12, fontWeight: 700, border: earlyBird ? '1px solid #fcd34d' : 'none' }}>
              🎉 Early Bird
            </span>
            {earlyBird ? (
              <span className="pricing-amount" style={{ margin: 0 }}>${earlyPrice}</span>
            ) : (
              <s style={{ fontSize: '1.4rem', color: '#bbb', fontWeight: 600 }}>${earlyPrice}</s>
            )}
          </div>
          {/* Until label */}
          <div style={{ fontSize: '0.78rem', color: earlyBird ? '#059669' : '#bbb', marginBottom: 12 }}>
            {earlyBird ? `✓ Active until ${EARLY_BIRD_LABEL}` : `Ended ${EARLY_BIRD_LABEL}`}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px dashed #ddd', margin: '0 20px 12px' }} />

          {/* Full price row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', color: earlyBird ? '#999' : '#555', fontWeight: 600 }}>
              Regular
            </span>
            {earlyBird ? (
              <s style={{ fontSize: '1.4rem', color: '#ccc', fontWeight: 600 }}>${fullPrice}</s>
            ) : (
              <span className="pricing-amount" style={{ margin: 0 }}>${fullPrice}</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: earlyBird ? '#bbb' : '#555', marginTop: 4 }}>
            {earlyBird ? `After ${EARLY_BIRD_LABEL}` : 'Current price'}
          </div>
        </div>
      )}

      <ul className="pricing-features">
        {p.features.map((f, j) => <li key={j}>{f}</li>)}
      </ul>

      {onSelect && !isFree && (
        <button
          onClick={() => onSelect(p.tier)}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 16, fontSize: '0.92rem', background: isWahs ? '#059669' : undefined }}
        >
          {isWahs ? 'Register Free →' : `Register as ${p.tier}`}
        </button>
      )}
    </div>
  );
}

export default function Registration({ pricing }: { pricing: Pricing[] }) {
  const earlyBird = isEarlyBird();
  const [step, setStep] = useState<'pricing' | 'form' | 'done' | 'wahs-done'>('pricing');
  const [selectedTier, setSelectedTier] = useState('');
  const [regType, setRegType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSelectTier(tier: string) {
    setSelectedTier(tier);
    setStep('form');
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      email: (form.get('email') as string).toLowerCase(),
      affiliation: form.get('affiliation') as string,
      country: form.get('country') as string,
      congress_year: 2026,
    };

    try {
      if (selectedTier === 'WAHS Member') {
        // Verify dues + register free — server-side check
        const res = await fetch('/api/registrations/wahs-member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Verification failed. Please contact wahskorea@gmail.com.');
          setLoading(false);
          return;
        }
        setStep('wahs-done');
      } else {
        const registration_type = form.get('registration_type') as string;
        const res = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, registration_type, congress_year: 2026 }),
        });
        if (!res.ok) throw new Error('Failed');
        setRegType(registration_type === 'regular' ? 'Regular' : 'Student');
        setStep('done');
      }
    } catch {
      setError('Registration failed. Please try again or contact wahskorea@gmail.com.');
    }
    setLoading(false);
  }

  return (
    <section className="registration" id="registration">
      <div className="section-inner reveal">
        <span className="section-label">Registration</span>
        <h2 className="section-title">Register</h2>
        <p className="section-lead" style={{ textAlign: 'center' }}>
          {earlyBird
            ? <>Early bird registration receives a 20% discount. Secure your spot at <strong>12th World Congress for Hallyu Studies 2026</strong>, NOW</>
            : <>Payments are processed securely via PayPal — credit and debit cards accepted.</>}
        </p>

        {/* Always-visible dual pricing cards */}
        <div className="pricing-grid" style={{ marginBottom: 48 }}>
          {pricing.map((p, i) => (
            <PricingCard
              key={i}
              p={p}
              earlyBird={earlyBird}
              onSelect={handleSelectTier}
            />
          ))}
        </div>

        {/* WAHS member note */}
        <div style={{ maxWidth: 640, margin: '0 auto 40px', padding: '20px 24px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8 }}>
          <p style={{ fontSize: '0.9rem', color: '#0369a1', margin: 0 }}>
            <strong>🎓 WAHS Members attend free.</strong> If you are an active WAHS member with no current dues, your congress registration is complimentary.{' '}
            <Link href="/wahs/login" style={{ color: '#0047A0', fontWeight: 700 }}>Sign in to your WAHS account →</Link>
          </p>
        </div>

        {/* Step 2: Registration form (shown after selecting tier) */}
        {step === 'form' && (
          <div style={{ maxWidth: 560, margin: '0 auto 48px', padding: '32px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button
                onClick={() => setStep('pricing')}
                style={{ background: 'none', border: 'none', color: '#0047A0', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontWeight: 600 }}
              >
                ← Back
              </button>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', margin: 0 }}>
                {selectedTier} Registration
              </h3>
            </div>
            {selectedTier === 'WAHS Member' ? (
              <p style={{ color: '#059669', fontSize: '0.9rem', marginBottom: 16 }}>
                Price: <strong>Free (WAHS Member)</strong> — your membership will be verified against WAHS records.
              </p>
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 24 }}>
                Price:{' '}
                <strong>
                  {earlyBird
                    ? `$${parseAmount(pricing.find(p => p.tier === selectedTier)?.early_bird || '$0')} (early bird)`
                    : `$${parseAmount(pricing.find(p => p.tier === selectedTier)?.amount || '$0')}`
                  }
                </strong>
              </p>
            )}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input type="text" name="name" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input type="email" name="email" className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Affiliation <span className="required">*</span></label>
                <input type="text" name="affiliation" className="form-input" placeholder="University or institution" required />
              </div>
              <div className="form-group">
                <label className="form-label">Country <span className="required">*</span></label>
                <input type="text" name="country" className="form-input" required />
              </div>
              {selectedTier !== 'WAHS Member' && (
                <input type="hidden" name="registration_type" value={selectedTier.toLowerCase()} />
              )}
              {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1, background: selectedTier === 'WAHS Member' ? '#059669' : undefined }}
              >
                {loading
                  ? (selectedTier === 'WAHS Member' ? 'Verifying...' : 'Registering...')
                  : (selectedTier === 'WAHS Member' ? 'Verify & Register Free →' : 'Continue to Payment →')}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation + PayPal */}
        {step === 'done' && (
          <div style={{ maxWidth: 560, margin: '0 auto 48px', padding: '32px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', marginBottom: 8 }}>Registration Received!</h3>
            <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: 24 }}>
              Complete your payment below to confirm your registration.
            </p>
            <a
              href={getPayPalLink(regType, earlyBird)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-paypal"
              style={{ display: 'inline-flex', fontSize: '1.05rem' }}
            >
              <PayPalIcon /> Pay with PayPal
            </a>
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: '#777' }}>
              Credit &amp; debit cards accepted. Registration confirmed after payment is verified.
            </p>
          </div>
        )}

        {/* WAHS Member free registration confirmed */}
        {step === 'wahs-done' && (
          <div style={{ maxWidth: 560, margin: '0 auto 48px', padding: '32px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎓</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', marginBottom: 8 }}>You&apos;re Registered!</h3>
            <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: 8 }}>
              Your WAHS membership has been verified and your registration for the <strong>12th World Congress for Hallyu Studies 2026</strong> is confirmed.
            </p>
            <p style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>No payment required — you&apos;re attending free as a WAHS member.</p>
          </div>
        )}

        <div className="payment-security-note">
          <span>🔒</span> All payments are securely processed through PayPal. No PayPal account needed — credit and debit cards are accepted directly.
        </div>
      </div>
    </section>
  );
}

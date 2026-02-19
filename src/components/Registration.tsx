'use client';
import { useState, FormEvent } from 'react';

type Pricing = { tier: string; amount: string; early_bird: string; features: string[]; featured: boolean };

const PayPalIcon = () => (
  <svg className="paypal-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.23A.774.774 0 0 1 5.708 1.6h6.727c2.23 0 3.88.462 4.907 1.374.966.857 1.393 2.133 1.27 3.792-.015.2-.043.407-.078.618a7.153 7.153 0 0 1-.11.56l-.04.18v.16l.122.074a3.548 3.548 0 0 1 .724.584c.388.436.644.97.753 1.564.113.612.084 1.34-.084 2.162-.193.95-.506 1.777-.93 2.46a5.252 5.252 0 0 1-1.47 1.6 5.947 5.947 0 0 1-1.97.908 9.14 9.14 0 0 1-2.435.295H12.57a.95.95 0 0 0-.94.805l-.04.2-.63 3.994-.03.147a.95.95 0 0 1-.938.805H7.076z"/>
  </svg>
);

// Early bird deadline: May 15, 2026 23:59:59 KST (UTC+9)
const EARLY_BIRD_DEADLINE = new Date('2026-05-15T23:59:59+09:00');

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
    full:  'https://www.paypal.com/ncp/payment/GWYKZDB2TBXRC',
  },
  'Student': {
    early: 'https://www.paypal.com/ncp/payment/69333BMBXNTUE',
    full:  'https://www.paypal.com/ncp/payment/FCVG73FR3RELG',
  },
};

function getPayPalLink(tier: string, earlyBird: boolean): string {
  const links = PAYPAL_LINKS[tier];
  if (links) return earlyBird ? links.early : links.full;
  return `mailto:wahskorea@gmail.com?subject=WAHS%202026%20Registration%20-%20${encodeURIComponent(tier)}`;
}

export default function Registration({ pricing }: { pricing: Pricing[] }) {
  const earlyBird = isEarlyBird();
  const [registered, setRegistered] = useState(false);
  const [regType, setRegType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const registration_type = form.get('registration_type') as string;
    const body = {
      name: form.get('name') as string,
      email: (form.get('email') as string).toLowerCase(),
      affiliation: form.get('affiliation') as string,
      country: form.get('country') as string,
      registration_type,
      congress_year: 2026,
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      setRegType(registration_type === 'regular' ? 'Regular' : 'Student');
      setRegistered(true);
    } catch {
      setError('Registration failed. Please try again or contact wahskorea@gmail.com.');
    }
    setLoading(false);
  }

  return (
    <section className="registration" id="registration">
      <div className="section-inner reveal">
        <span className="section-label">Registration</span>
        <h2 className="section-title">Register &amp; Pay</h2>
        <p className="section-lead">
          {earlyBird
            ? <>🎉 <strong>Early bird pricing active!</strong> Register by May 15, 2026 (KST) to save 20%. Payments are securely processed via PayPal.</>
            : <>Payments are securely processed via PayPal — credit and debit cards accepted.</>
          }
        </p>

        {!registered ? (
          <>
            {/* Registration Form */}
            <div style={{ maxWidth: 560, margin: '0 auto 48px', padding: '32px', background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', marginBottom: 4, textAlign: 'center' }}>
                Step 1: Register Your Details
              </h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: 24 }}>
                Fill out the form below, then proceed to payment.
              </p>
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
                  <label className="form-label">Affiliation</label>
                  <input type="text" name="affiliation" className="form-input" placeholder="University or institution" />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input type="text" name="country" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Type <span className="required">*</span></label>
                  <select name="registration_type" className="form-select" required>
                    <option value="">Select type...</option>
                    <option value="regular">Regular {earlyBird ? '— $240 (early bird)' : '— $300'}</option>
                    <option value="student">Student {earlyBird ? '— $120 (early bird)' : '— $150'}</option>
                  </select>
                </div>
                {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Registering...' : 'Continue to Payment →'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            {/* Post-registration: show confirmation + PayPal */}
            <div style={{ maxWidth: 560, margin: '0 auto 32px', padding: '24px', background: '#f0fdf4', border: '1px solid #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', marginBottom: 8 }}>Registration Received!</h3>
              <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: 20 }}>
                Please complete your payment below to confirm your registration.
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
                Credit &amp; debit cards accepted. Your registration will be confirmed once payment is verified.
              </p>
            </div>

            {/* Still show pricing cards for reference */}
            <div className="pricing-grid">
              {pricing.map((p, i) => {
                const fullPrice = parseAmount(p.amount);
                const earlyPrice = parseAmount(p.early_bird);
                const isFree = p.amount === 'Free';

                return (
                  <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={i}>
                    <div className="pricing-tier">{p.tier}</div>
                    {isFree ? (
                      <div className="pricing-amount">Free</div>
                    ) : earlyBird ? (
                      <>
                        <div className="pricing-amount">${earlyPrice}</div>
                        <div className="pricing-note"><s>${fullPrice}</s> — 20% discount · By May 15, 2026</div>
                      </>
                    ) : (
                      <div className="pricing-amount">${fullPrice}</div>
                    )}
                    <ul className="pricing-features">
                      {p.features.map((f, j) => <li key={j}>{f}</li>)}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!registered && (
          <div className="payment-security-note">
            <span>🔒</span> All payments are securely processed through PayPal. You do not need a PayPal account — credit and debit cards are accepted directly.
          </div>
        )}
      </div>
    </section>
  );
}

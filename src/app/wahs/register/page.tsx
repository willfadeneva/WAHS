'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Chile','China',
  'Colombia','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France','Gabon','Georgia','Germany',
  'Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Madagascar','Malaysia','Mali','Malta','Mexico',
  'Moldova','Mongolia','Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','North Korea','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia',
  'Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other',
];

type StepState = 'form' | 'payment';

export default function WAHSRegisterPage() {
  const [step, setStep] = useState<StepState>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paypalUrl, setPaypalUrl] = useState('');
  const [membershipType, setMembershipType] = useState<'professional' | 'student'>('professional');

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
      country: form.get('country') as string,
      membership_type: form.get('membership_type') as string,
    };

    try {
      const res = await fetch('/api/wahs/register', {
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
      setPaypalUrl(data.paypalUrl);
      setStep('payment');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Join WAHS</h1>
            <p className="main-page-subtitle">Create your membership account and join our global community</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 560, margin: '0 auto' }}>
            {step === 'form' ? (
              <div className="main-content-box">
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 8, color: 'var(--navy)' }}>
                  Create Your Account
                </h2>
                <p style={{ color: 'var(--slate)', marginBottom: 28, fontSize: '0.92rem' }}>
                  Already a member? <Link href="/wahs/login" style={{ color: 'var(--kr-blue)' }}>Sign in here</Link>
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
                  <div className="form-group">
                    <label className="form-label">Country <span className="required">*</span></label>
                    <select name="country" className="form-select" required>
                      <option value="">Select country…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Membership Type <span className="required">*</span></label>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', flex: 1, padding: 16, border: `2px solid ${membershipType === 'professional' ? 'var(--kr-blue)' : 'var(--pearl)'}`, borderRadius: 4 }}>
                        <input
                          type="radio"
                          name="membership_type"
                          value="professional"
                          checked={membershipType === 'professional'}
                          onChange={() => setMembershipType('professional')}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Professional</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>$250 / year</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: 4 }}>Researchers, academics, practitioners</div>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', flex: 1, padding: 16, border: `2px solid ${membershipType === 'student' ? 'var(--kr-blue)' : 'var(--pearl)'}`, borderRadius: 4 }}>
                        <input
                          type="radio"
                          name="membership_type"
                          value="student"
                          checked={membershipType === 'student'}
                          onChange={() => setMembershipType('student')}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Student</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--slate)' }}>$150 / year</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: 4 }}>Students & independent researchers</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Creating Account…' : 'Create Account & Continue to Payment →'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="main-content-box" style={{ textAlign: 'center' }}>
                <div className="form-success">
                  <div className="form-success-icon">✅</div>
                  <h3>Account Created!</h3>
                  <p style={{ marginBottom: 24 }}>
                    Your WAHS account has been created. Please complete your payment via PayPal
                    to activate your membership. Your account will be confirmed once payment is verified.
                  </p>
                  <a
                    href={paypalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-paypal"
                    style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}
                  >
                    <svg className="paypal-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.79a.641.641 0 01.632-.535h6.964c2.36 0 4.043.498 4.97 1.48.899.953 1.15 2.237.747 3.813-.016.063-.03.127-.048.192-.748 3.097-3.3 4.676-7.583 4.676h-2.01a.641.641 0 00-.633.536l-.647 4.15-.66 4.235z"/>
                    </svg>
                    Pay {membershipType === 'professional' ? '$250' : '$150'} with PayPal
                  </a>
                  <p style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--mist)' }}>
                    Credit &amp; debit cards accepted through PayPal
                  </p>
                  <p style={{ marginTop: 16, fontSize: '0.85rem' }}>
                    After payment, you&apos;ll be redirected to a confirmation page.
                    Questions? <a href="mailto:wahskorea@gmail.com" style={{ color: 'var(--kr-blue)' }}>wahskorea@gmail.com</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

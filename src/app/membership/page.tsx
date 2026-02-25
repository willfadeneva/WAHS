'use client';
import { useState, FormEvent } from 'react';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

const PAYPAL_LINKS: Record<string, string> = {
  professional: 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  non_professional: 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export default function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const membership_type = form.get('membership_type') as string;
    const body = {
      full_name: form.get('name') as string,
      email: (form.get('email') as string).toLowerCase(),
      institution: form.get('affiliation') as string,
      country: form.get('country') as string,
      membership_type,
    };

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSelectedType(membership_type);
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again or contact wahskorea@gmail.com.');
    }
    setLoading(false);
  }

  return (
    <div className="main-page">
      <MainNav />
      
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Membership</h1>
            <p className="main-page-subtitle">
              Join our global community of Hallyu scholars and practitioners
            </p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner">
            <div className="main-membership-tiers">
              
              {/* Professional Membership */}
              <div className="main-membership-tier">
                <div className="main-membership-tier-header">
                  <h2>Professional Membership</h2>
                  <div className="main-membership-price">
                    <span className="main-membership-amount">$250</span>
                    <span className="main-membership-period">/year</span>
                  </div>
                </div>
                <div className="main-membership-tier-content">
                  <p>
                    For academic professionals, researchers, and industry practitioners 
                    engaged in Hallyu studies and related fields.
                  </p>
                  <ul className="main-membership-benefits">
                    <li>Free registration for WAHS World Congress</li>
                    <li>Access to WAHS academic journal and publications</li>
                    <li>Priority submission for conference presentations</li>
                    <li>Networking opportunities with international scholars</li>
                    <li>Voting rights in WAHS governance matters</li>
                    <li>Access to member-only research resources</li>
                    <li>Discounts on WAHS events and workshops</li>
                  </ul>
                </div>
              </div>

              {/* Non-Professional Membership */}
              <div className="main-membership-tier">
                <div className="main-membership-tier-header">
                  <h2>Non-Professional Membership</h2>
                  <div className="main-membership-price">
                    <span className="main-membership-amount">$150</span>
                    <span className="main-membership-period">/year</span>
                  </div>
                </div>
                <div className="main-membership-tier-content">
                  <p>
                    For students, independent researchers, and enthusiasts interested 
                    in Hallyu studies and Korean culture.
                  </p>
                  <ul className="main-membership-benefits">
                    <li>Discounted registration for WAHS World Congress</li>
                    <li>Access to selected WAHS publications</li>
                    <li>Opportunity to submit conference presentations</li>
                    <li>Access to webinars and online events</li>
                    <li>Member directory access</li>
                    <li>Quarterly newsletter subscription</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            {!submitted ? (
              <section style={{ maxWidth: 600, margin: '48px auto 0' }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', textAlign: 'center', marginBottom: 8 }}>
                  Apply for Membership
                </h2>
                <p style={{ textAlign: 'center', color: '#555', marginBottom: 32, fontSize: '0.95rem' }}>
                  Fill out the form below, then complete payment via PayPal.
                </p>
                <form onSubmit={handleSubmit}>
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
                    <label className="form-label">Membership Type <span className="required">*</span></label>
                    <select name="membership_type" className="form-select" required>
                      <option value="">Select type...</option>
                      <option value="professional">Professional — $250/year</option>
                      <option value="non_professional">Non-Professional — $150/year</option>
                    </select>
                  </div>
                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
                    {loading ? 'Submitting...' : 'Continue to Payment →'}
                  </button>
                </form>
              </section>
            ) : (
              <section style={{ maxWidth: 600, margin: '48px auto 0', textAlign: 'center' }}>
                <div className="form-success">
                  <div className="form-success-icon">✅</div>
                  <h3>Application Received!</h3>
                  <p style={{ marginBottom: 24 }}>
                    Please complete your payment via PayPal to activate your membership.
                    Your membership will be confirmed once payment is verified.
                  </p>
                  <a
                    href={PAYPAL_LINKS[selectedType]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-paypal"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '1.05rem' }}
                  >
                    Pay {selectedType === 'professional' ? '$250' : '$150'} with PayPal
                  </a>
                  <p style={{ marginTop: 16, fontSize: '0.85rem', color: '#777' }}>
                    Credit &amp; debit cards accepted. Questions? Contact{' '}
                    <a href="mailto:wahskorea@gmail.com">wahskorea@gmail.com</a>
                  </p>
                </div>
              </section>
            )}

            {/* Additional Information */}
            <section className="main-membership-info">
              <div className="main-content-grid">
                <div className="main-content-box">
                  <h3>Benefits Overview</h3>
                  <p>
                    WAHS membership provides access to our global network of scholars, 
                    exclusive research resources, and opportunities to present your work 
                    at our prestigious World Congress.
                  </p>
                </div>
                
                <div className="main-content-box">
                  <h3>Payment &amp; Billing</h3>
                  <p>
                    Membership fees are billed annually. All payments are processed 
                    securely through PayPal. Membership benefits begin immediately 
                    upon payment confirmation.
                  </p>
                </div>
                
                <div className="main-content-box">
                  <h3>Questions?</h3>
                  <p>
                    Need help choosing the right membership tier or have questions 
                    about benefits? Contact us at{' '}
                    <a href="mailto:wahskorea@gmail.com">wahskorea@gmail.com</a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}

type Pricing = { tier: string; amount: string; early_bird: string; features: string[]; featured: boolean };

const PayPalIcon = () => (
  <svg className="paypal-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.23A.774.774 0 0 1 5.708 1.6h6.727c2.23 0 3.88.462 4.907 1.374.966.857 1.393 2.133 1.27 3.792-.015.2-.043.407-.078.618a7.153 7.153 0 0 1-.11.56l-.04.18v.16l.122.074a3.548 3.548 0 0 1 .724.584c.388.436.644.97.753 1.564.113.612.084 1.34-.084 2.162-.193.95-.506 1.777-.93 2.46a5.252 5.252 0 0 1-1.47 1.6 5.947 5.947 0 0 1-1.97.908 9.14 9.14 0 0 1-2.435.295H12.57a.95.95 0 0 0-.94.805l-.04.2-.63 3.994-.03.147a.95.95 0 0 1-.938.805H7.076z"/>
  </svg>
);

export default function Registration({ pricing }: { pricing: Pricing[] }) {
  return (
    <section className="registration" id="registration">
      <div className="section-inner reveal">
        <span className="section-label">Registration</span>
        <h2 className="section-title">Register &amp; Pay</h2>
        <p className="section-lead">Early bird registration receives a 20% discount. Payments are securely processed via PayPal — credit and debit cards accepted.</p>
        <div className="pricing-grid">
          {pricing.map((p, i) => (
            <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={i}>
              <div className="pricing-tier">{p.tier}</div>
              <div className="pricing-amount">{p.amount}</div>
              <div className="pricing-note">Early bird: {p.early_bird}</div>
              <ul className="pricing-features">
                {p.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              {p.amount === 'Free' ? (
                <a href="mailto:wahskorea@gmail.com?subject=WAHS%20Member%20Registration" className="btn-paypal btn-member">
                  Register via Email
                </a>
              ) : (
                <a href="#" className="btn-paypal">
                  <PayPalIcon /> Pay with PayPal
                </a>
              )}
              <div className="paypal-subtext">Credit &amp; debit cards accepted</div>
            </div>
          ))}
        </div>
        <div className="payment-security-note">
          <span>🔒</span> All payments are securely processed through PayPal. You do not need a PayPal account — credit and debit cards are accepted directly.
        </div>
      </div>
    </section>
  );
}

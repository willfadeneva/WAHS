'use client';

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

function getPayPalLink(amount: number, tier: string): string {
  // PayPal payment link - update with actual PayPal business email
  const desc = encodeURIComponent(`WAHS 2026 Congress Registration - ${tier}`);
  return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=wahskorea@gmail.com&amount=${amount}&currency_code=USD&item_name=${desc}`;
}

export default function Registration({ pricing }: { pricing: Pricing[] }) {
  const earlyBird = isEarlyBird();

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
        <div className="pricing-grid">
          {pricing.map((p, i) => {
            const fullPrice = parseAmount(p.amount);
            const earlyPrice = parseAmount(p.early_bird);
            const activePrice = earlyBird ? earlyPrice : fullPrice;
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
                {isFree ? (
                  <a href="mailto:wahskorea@gmail.com?subject=WAHS%20Member%20Registration" className="btn-paypal btn-member">
                    Register via Email
                  </a>
                ) : (
                  <a href={getPayPalLink(activePrice, p.tier)} className="btn-paypal" target="_blank" rel="noopener noreferrer">
                    <PayPalIcon /> Pay ${activePrice} with PayPal
                  </a>
                )}
                {!isFree && <div className="paypal-subtext">Credit &amp; debit cards accepted</div>}
              </div>
            );
          })}
        </div>
        <div className="payment-security-note">
          <span>🔒</span> All payments are securely processed through PayPal. You do not need a PayPal account — credit and debit cards are accepted directly.
        </div>
      </div>
    </section>
  );
}

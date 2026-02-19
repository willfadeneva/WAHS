import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

export default function MembershipPage() {
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
                  <a href="#" className="main-membership-button main-membership-button-professional">
                    Join as Professional Member
                  </a>
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
                  <a href="#" className="main-membership-button main-membership-button-non-professional">
                    Join as Non-Professional Member
                  </a>
                </div>
              </div>
            </div>

            {/* Existing Members Login */}
            <section className="main-membership-login">
              <div className="main-membership-login-inner">
                <h2>Existing Members</h2>
                <p>
                  Already a WAHS member? Access your member portal to manage your 
                  subscription, update your profile, and connect with other members.
                </p>
                <div className="main-membership-login-form">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="main-membership-input"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="main-membership-input"
                  />
                  <button className="main-membership-button main-membership-button-login">
                    Sign In
                  </button>
                </div>
                <p className="main-membership-forgot">
                  <a href="#">Forgot your password?</a>
                </p>
              </div>
            </section>

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
                  <h3>Payment & Billing</h3>
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
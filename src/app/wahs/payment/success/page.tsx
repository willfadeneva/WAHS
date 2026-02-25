import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

export default function PaymentSuccessPage() {
  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Payment Received</h1>
            <p className="main-page-subtitle">Thank you for joining WAHS</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <div className="main-content-box">
              <div className="form-success">
                <div className="form-success-icon">🎉</div>
                <h3>Thank You for Your Payment!</h3>
                <p>
                  Your payment has been received. Your WAHS membership will be activated shortly
                  once our team verifies your payment. You&apos;ll receive a confirmation email
                  when your account is activated.
                </p>
                <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--mist)' }}>
                  If you have any questions, please contact{' '}
                  <a href="mailto:wahskorea@gmail.com" style={{ color: 'var(--kr-blue)' }}>wahskorea@gmail.com</a>
                </p>
                <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/wahs/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                  <Link href="/" className="btn-outline" style={{ color: 'var(--navy)', borderColor: 'rgba(0,0,0,0.2)' }}>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

'use client';
import { useState } from 'react';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Link from 'next/link';

// Direct PayPal links
const PAYPAL_LINKS = {
  professional: 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  non_professional: 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export default function SimpleMembershipPage() {
  const [selectedType, setSelectedType] = useState<'professional' | 'non_professional' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinWAHS = () => {
    if (!selectedType) {
      setError('Please select a membership type');
      return;
    }

    setLoading(true);
    setError('');

    // Build PayPal URL with return parameters
    const paypalLink = PAYPAL_LINKS[selectedType];
    const returnUrl = `https://congress.iwahs.org/wahs/payment/success?membership=${selectedType}`;
    
    // Redirect to PayPal
    window.location.href = `${paypalLink}?return=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <div className="main-page">
      <MainNav />
      
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Join WAHS</h1>
            <p className="main-page-subtitle">
              Become a member of the World Association for Hallyu Studies
            </p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {error && (
              <div className="error-message" style={{
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                color: '#721c24',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ margin: 0 }}>❌ {error}</p>
              </div>
            )}

            {/* Membership Type Selection */}
            <div className="main-membership-tiers" style={{ marginBottom: '40px' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0047A0' }}>
                Choose Your Membership
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '30px',
                marginBottom: '40px'
              }}>
                {/* Professional Membership */}
                <div style={{ 
                  background: selectedType === 'professional' ? '#f0f7ff' : '#fff',
                  border: selectedType === 'professional' ? '2px solid #0047A0' : '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} onClick={() => setSelectedType('professional')}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: '#0047A0',
                    marginBottom: '15px'
                  }}>
                    Professional
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    color: '#000',
                    marginBottom: '20px'
                  }}>
                    $250<span style={{ fontSize: '1rem', color: '#666' }}>/year</span>
                  </div>
                  <ul style={{ 
                    textAlign: 'left', 
                    marginBottom: '25px',
                    paddingLeft: '20px',
                    color: '#333'
                  }}>
                    <li>Full voting rights</li>
                    <li>Conference discounts</li>
                    <li>Research collaboration</li>
                    <li>Member directory listing</li>
                    <li>Newsletter & updates</li>
                  </ul>
                  <div style={{ 
                    padding: '12px',
                    background: selectedType === 'professional' ? '#0047A0' : '#6c757d',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {selectedType === 'professional' ? '✓ Selected' : 'Select'}
                  </div>
                </div>

                {/* Non-Professional Membership */}
                <div style={{ 
                  background: selectedType === 'non_professional' ? '#f0f7ff' : '#fff',
                  border: selectedType === 'non_professional' ? '2px solid #0047A0' : '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '30px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} onClick={() => setSelectedType('non_professional')}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: '#0047A0',
                    marginBottom: '15px'
                  }}>
                    Non-Professional
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    color: '#000',
                    marginBottom: '20px'
                  }}>
                    $150<span style={{ fontSize: '1rem', color: '#666' }}>/year</span>
                  </div>
                  <ul style={{ 
                    textAlign: 'left', 
                    marginBottom: '25px',
                    paddingLeft: '20px',
                    color: '#333'
                  }}>
                    <li>Basic membership</li>
                    <li>Conference access</li>
                    <li>Community participation</li>
                    <li>Member directory listing</li>
                    <li>Newsletter & updates</li>
                  </ul>
                  <div style={{ 
                    padding: '12px',
                    background: selectedType === 'non_professional' ? '#0047A0' : '#6c757d',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {selectedType === 'non_professional' ? '✓ Selected' : 'Select'}
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleJoinWAHS}
                  disabled={loading || !selectedType}
                  style={{
                    padding: '16px 50px',
                    background: !selectedType ? '#ccc' : loading ? '#CD2E3A' : '#CD2E3A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: !selectedType ? 'not-allowed' : loading ? 'wait' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Redirecting to PayPal...' : 'Join WAHS Now'}
                </button>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginTop: '15px',
                  textAlign: 'center'
                }}>
                  You will be redirected to PayPal to complete your payment.
                </p>
              </div>
            </div>

            {/* Member Login Section */}
            <div style={{ 
              marginTop: '40px', 
              padding: '25px', 
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#0047A0' }}>Already a Member?</h3>
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '1.05rem' }}>
                Access your member dashboard, update your profile, and connect with other members.
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <Link href="/wahs/login" style={{
                  padding: '12px 30px',
                  background: '#0047A0',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '1rem'
                }}>
                  Member Login
                </Link>
                <Link href="/wahs/register" style={{
                  padding: '12px 30px',
                  background: 'transparent',
                  color: '#0047A0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '1rem',
                  border: '1px solid #0047A0'
                }}>
                  Create Account
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
      
      <MainFooter />
    </div>
  );
}
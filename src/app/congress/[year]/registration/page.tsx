'use client';

import { useState, useEffect } from 'react';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Breadcrumbs from '@/components/Breadcrumbs';

// Simple pricing - no early bird logic for now
const PRICES = {
  REGULAR: 300,
  STUDENT: 150,
  WAHS_MEMBER: 0
};

// PayPal links
const PAYPAL_LINKS = {
  REGULAR: 'https://www.paypal.com/ncp/payment/5HCS2HYEPSTSG',
  STUDENT: 'https://www.paypal.com/ncp/payment/GWYKZDB2TBXRC',
  WAHS_MEMBER: 'https://www.paypal.com/ncp/payment/69333BMBXNTUE'
};

export default function SimpleRegistrationPage({ params }: { params: { year: string } }) {
  const { year: yearStr } = params;
  const year = parseInt(yearStr);
  
  const [isValidYear, setIsValidYear] = useState(true);

  useEffect(() => {
    if (isNaN(year) || year < 2000 || year > 2100) {
      setIsValidYear(false);
    }
  }, [year]);

  if (!isValidYear) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Year</h1>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainNav />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      
      <section style={{ background: '#fff', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: '2.5rem', 
            color: '#000', 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            Registration - WAHS Congress {year}
          </h1>
          
          <p style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem', 
            color: '#555', 
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Cheju Halla University, Jeju Island, South Korea<br />
            May 28–30, {year}
          </p>
          
          {/* Registration Options */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px',
            marginBottom: '60px'
          }}>
            {/* Regular Registration */}
            <div style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
              background: '#f9f9f9'
            }}>
              <h3 style={{ 
                fontFamily: "'DM Serif Display', serif", 
                fontSize: '1.5rem', 
                color: '#000', 
                marginBottom: '15px' 
              }}>
                Regular
              </h3>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#0047A0',
                marginBottom: '20px'
              }}>
                ${PRICES.REGULAR}
              </div>
              <ul style={{ 
                textAlign: 'left', 
                paddingLeft: '20px', 
                marginBottom: '30px',
                fontSize: '0.95rem',
                color: '#444'
              }}>
                <li>Full conference access</li>
                <li>Conference materials</li>
                <li>Lunch & coffee breaks</li>
                <li>Welcome reception</li>
                <li>Conference dinner</li>
              </ul>
              <a 
                href={PAYPAL_LINKS.REGULAR}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#CD2E3A',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.3s',
                  display: 'block',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
                className="register-button"
                onMouseOver={(e) => e.currentTarget.style.background = '#b0262e'}
                onMouseOut={(e) => e.currentTarget.style.background = '#CD2E3A'}
              >
                Register Now (PayPal)
              </a>
            </div>
            
            {/* Student Registration */}
            <div style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
              background: '#f9f9f9',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0047A0',
                color: 'white',
                padding: '4px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                STUDENT
              </div>
              <h3 style={{ 
                fontFamily: "'DM Serif Display', serif", 
                fontSize: '1.5rem', 
                color: '#000', 
                marginBottom: '15px',
                marginTop: '10px'
              }}>
                Student
              </h3>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#0047A0',
                marginBottom: '20px'
              }}>
                ${PRICES.STUDENT}
              </div>
              <ul style={{ 
                textAlign: 'left', 
                paddingLeft: '20px', 
                marginBottom: '30px',
                fontSize: '0.95rem',
                color: '#444'
              }}>
                <li>Full conference access</li>
                <li>Conference materials</li>
                <li>Lunch & coffee breaks</li>
                <li>Welcome reception</li>
                <li>Student ID required</li>
              </ul>
              <a 
                href={PAYPAL_LINKS.STUDENT}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#0047A0',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.3s',
                  display: 'block',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
                className="register-button"
                onMouseOver={(e) => e.currentTarget.style.background = '#003680'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0047A0'}
              >
                Register Now (PayPal)
              </a>
            </div>
            
            {/* WAHS Member Registration */}
            <div style={{
              border: '2px solid #CD2E3A',
              borderRadius: '8px',
              padding: '30px',
              textAlign: 'center',
              background: '#fff',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#CD2E3A',
                color: 'white',
                padding: '4px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                WAHS MEMBER
              </div>
              <h3 style={{ 
                fontFamily: "'DM Serif Display', serif", 
                fontSize: '1.5rem', 
                color: '#000', 
                marginBottom: '15px',
                marginTop: '10px'
              }}>
                WAHS Member
              </h3>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#CD2E3A',
                marginBottom: '20px'
              }}>
                Free
              </div>
              <ul style={{ 
                textAlign: 'left', 
                paddingLeft: '20px', 
                marginBottom: '30px',
                fontSize: '0.95rem',
                color: '#444'
              }}>
                <li>Full conference access</li>
                <li>Conference materials</li>
                <li>Lunch & coffee breaks</li>
                <li>Welcome reception</li>
                <li>Conference dinner</li>
                <li>Member-only sessions</li>
              </ul>
              <a 
                href={PAYPAL_LINKS.WAHS_MEMBER}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #CD2E3A 0%, #0047A0 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'transform 0.3s',
                  display: 'block',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
                className="register-button-gradient"
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Register Now (PayPal)
              </a>
              <p style={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                marginTop: '10px',
                textAlign: 'center'
              }}>
                WAHS members: <a href="/wahs/login" style={{ color: '#CD2E3A' }}>Login to verify membership</a>
              </p>
            </div>
          </div>
          
          {/* Important Dates */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: "'DM Serif Display', serif", 
              fontSize: '1.8rem', 
              color: '#000', 
              marginBottom: '20px' 
            }}>
              Important Dates
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              <div style={{ 
                padding: '20px', 
                background: '#f8f8f8',
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Abstract Submission</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  Deadline: <strong>March 31, {year}</strong>
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Notification: April 15, {year}
                </p>
              </div>
              
              <div style={{ padding: '20px', background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Conference Dates</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  <strong>May 28–30, {year}</strong>
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Cheju Halla University, Jeju Island
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,71,160,0.05) 0%, rgba(205,46,58,0.05) 100%)', 
            padding: '30px', 
            borderRadius: '8px',
            border: '1px solid rgba(0,71,160,0.2)'
          }}>
            <h2 style={{ 
              fontFamily: "'DM Serif Display', serif", 
              fontSize: '1.5rem', 
              color: '#000', 
              marginBottom: '15px' 
            }}>
              Payment Information
            </h2>
            
            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '15px' }}>
              All payments are processed securely through PayPal. You can pay with:
            </p>
            
            <ul style={{ 
              fontSize: '0.95rem', 
              color: '#444', 
              paddingLeft: '20px',
              marginBottom: '20px'
            }}>
              <li>Credit/Debit Card (via PayPal)</li>
              <li>PayPal account</li>
              <li>Bank transfer (contact for details)</li>
            </ul>
            
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              <strong>Note:</strong> WAHS members must be logged in to access free registration.
              Student registrants must provide valid student ID.
            </p>
          </div>
        </div>
      </section>
      
      <MainFooter />
    </>
  );
}
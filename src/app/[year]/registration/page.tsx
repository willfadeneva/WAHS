import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  isEarlyBirdAvailable, 
  getCurrentPrice, 
  getPriceDisplay,
  getEarlyBirdDisplayHtml,
  formatTimeRemaining 
} from '@/lib/early-bird';

export default async function RegistrationPage({ 
  params 
}: { 
  params: Promise<{ year: string }> 
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr);
  
  const isEarlyBird = isEarlyBirdAvailable();
  const timeRemaining = formatTimeRemaining();
  
  const prices = {
    regular: getCurrentPrice('REGULAR'),
    student: getCurrentPrice('STUDENT'),
    wahsMember: getCurrentPrice('WAHS_MEMBER')
  };

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
          
          {/* Early Bird Countdown */}
          <div dangerouslySetInnerHTML={{ __html: getEarlyBirdDisplayHtml() }} />
          
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
              }} dangerouslySetInnerHTML={{ __html: getPriceDisplay('REGULAR') }} />
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
                href="https://www.paypal.com/ncp/payment/5HCS2HYEPSTSG" 
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
              }} dangerouslySetInnerHTML={{ __html: getPriceDisplay('STUDENT') }} />
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
                href="https://www.paypal.com/ncp/payment/GWYKZDB2TBXRC" 
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
                href="https://www.paypal.com/ncp/payment/69333BMBXNTUE" 
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
            </div>
          </div>
          
          {/* Two Registration Paths */}
          <div style={{ 
            background: '#f8f8f8', 
            padding: '40px', 
            borderRadius: '8px',
            marginBottom: '40px'
          }}>
            <h2 style={{ 
              fontFamily: "'DM Serif Display', serif", 
              fontSize: '1.8rem', 
              color: '#000', 
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Choose Your Registration Path
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {/* Path 1: Just Attend */}
              <div style={{ 
                background: 'white', 
                padding: '25px', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  color: '#0047A0', 
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  Just Attend the Conference
                </h3>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#0047A0', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>1</div>
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>Select Ticket Type</span>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#0047A0', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>2</div>
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>Pay via PayPal</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#0047A0', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>3</div>
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>Receive Confirmation</span>
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginTop: '20px',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  Simple one-time payment. No account needed.
                </p>
              </div>
              
              {/* Path 2: Submit Research */}
              <div style={{ 
                background: 'white', 
                padding: '25px', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  color: '#CD2E3A', 
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  Submit Research & Present
                </h3>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    background: '#CD2E3A', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>1</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Sign up for abstract submission</span>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    background: '#CD2E3A', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>2</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Submit your abstract</span>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    background: '#CD2E3A', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>3</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Wait for committee review</span>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    background: '#CD2E3A', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>4</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>If accepted, register & pay</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '35px', 
                    height: '35px', 
                    background: '#CD2E3A', 
                    color: 'white', 
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginRight: '8px'
                  }}>5</div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Present at conference</span>
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginTop: '20px',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  Requires account to manage submissions.
                  <br />
                  <a href="/congress/submit-abstract" style={{ color: '#CD2E3A', textDecoration: 'underline' }}>
                    Start abstract submission →
                  </a>
                </p>
              </div>
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
                background: isEarlyBird ? 'linear-gradient(135deg, rgba(0,71,160,0.1) 0%, rgba(205,46,58,0.1) 100%)' : '#f8f8f8',
                border: isEarlyBird ? '2px solid #CD2E3A' : '1px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: isEarlyBird ? '#CD2E3A' : '#000' }}>
                  {isEarlyBird ? '🎯 Early Bird Registration' : 'Early Bird Registration'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  Deadline: <strong>May 15, 2026 23:59:59 KST</strong>
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  {isEarlyBird ? `Time remaining: ${timeRemaining}` : 'Closed'}
                </p>
              </div>
              
              <div style={{ padding: '20px', background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Abstract Submission</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  Deadline: <strong>March 31, 2026</strong>
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Notification: April 15, 2026
                </p>
              </div>
              
              <div style={{ padding: '20px', background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Conference Dates</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                  <strong>May 28–30, 2026</strong>
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
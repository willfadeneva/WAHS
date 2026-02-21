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
              <button style={{
                background: '#CD2E3A',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                transition: 'background 0.3s'
              }} className="register-button">
                Register Now
              </button>
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
              <button style={{
                background: '#0047A0',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                transition: 'background 0.3s'
              }} className="register-button">
                Register Now
              </button>
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
              <button style={{
                background: 'linear-gradient(135deg, #CD2E3A 0%, #0047A0 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                transition: 'transform 0.3s'
              }} className="register-button-gradient">
                Register Now
              </button>
            </div>
          </div>
          
          {/* Registration Process */}
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
              marginBottom: '20px' 
            }}>
              Registration Process
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#0047A0', 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 15px'
                }}>1</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Submit Abstract</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Submit your abstract through the Call for Papers
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#0047A0', 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 15px'
                }}>2</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Wait for Approval</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Committee reviews and notifies you of acceptance
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#0047A0', 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 15px'
                }}>3</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Complete Registration</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Register and pay registration fees
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: '#0047A0', 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 15px'
                }}>4</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Receive Confirmation</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Get conference details and preparation materials
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
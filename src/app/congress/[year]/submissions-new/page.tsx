'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProtectedSubmissionsPage({ params }: { params: { year: string } }) {
  const { year: yearStr } = params;
  const year = parseInt(yearStr);
  const router = useRouter();
  const { user, userType, loading } = useAuth();
  
  const [isValidYear, setIsValidYear] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    presentationType: 'oral',
    track: 'general',
    agreeToTerms: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validate year
  useEffect(() => {
    if (isNaN(year) || year < 2000 || year > 2100) {
      setIsValidYear(false);
    }
  }, [year]);

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to Congress login
      router.push(`/congress/login?redirect=/2026/submissions-new`);
    } else if (!loading && user && userType !== 'congress') {
      // Logged in but wrong user type
      if (userType === 'wahs') {
        router.push('/wahs/dashboard');
      } else if (userType === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, userType, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  if (!user || userType !== 'congress') {
    // Should have been redirected, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    
    if (!formData.agreeToTerms) {
      setSubmitError('You must agree to the terms and conditions');
      setSubmitting(false);
      return;
    }

    try {
      // Submit with user authentication
      const response = await fetch('/api/submit-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // In production, use proper JWT
        },
        body: JSON.stringify({
          ...formData,
          year,
          userId: user.id,
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      setSubmitSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/congress/dashboard');
      }, 3000);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again or contact wahskorea@gmail.com.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <Nav year={year} />
      <div style={{ paddingTop: '80px' }}><Breadcrumbs /></div>
      
      <section style={{ background: '#fff', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '8px', border: '1px solid #b6d4fe' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#004085' }}>
              <strong>Logged in as:</strong> {user.email} •{' '}
              <a href="/congress/dashboard" style={{ color: '#0047A0', textDecoration: 'underline' }}>View your submissions</a> •{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); /* Add sign out */ }} style={{ color: '#CD2E3A', textDecoration: 'underline' }}>Sign out</a>
            </p>
          </div>
          
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: '2.5rem', 
            color: '#000', 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}>
            Submit Abstract - WAHS Congress {year}
          </h1>
          
          <p style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem', 
            color: '#555', 
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Submit your research abstract for the 12th World Congress for Hallyu Studies.
            Deadline: March 31, {year}
          </p>

          {submitSuccess ? (
            <div style={{ 
              background: '#d4edda', 
              border: '1px solid #c3e6cb',
              color: '#155724',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>✅ Submission Successful!</h3>
              <p>Thank you for submitting your abstract. It has been saved to your account.</p>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                <strong>Note:</strong> 
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  <li>The committee will review all submissions and notify authors by April 15, {year}.</li>
                  <li>You can view and manage your submissions in your <a href="/congress/dashboard" style={{ color: '#155724', textDecoration: 'underline' }}>dashboard</a>.</li>
                  <li>If accepted, you must register for the conference to present.</li>
                </ul>
              </p>
              <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
                Redirecting to your dashboard in 3 seconds...
              </p>
            </div>
          ) : (
            <>
              {submitError && (
                <div style={{ 
                  background: '#f8d7da', 
                  border: '1px solid #f5c6cb',
                  color: '#721c24',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '30px'
                }}>
                  <p style={{ margin: 0 }}>❌ {submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0047A0' }}>Abstract Details</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Presentation Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="Enter your presentation title"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Abstract (300-500 words) *
                    </label>
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleChange}
                      required
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                      placeholder="Enter your abstract here..."
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="e.g., K-pop, Hallyu, digital media, globalization"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Presentation Type *
                      </label>
                      <select
                        name="presentationType"
                        value={formData.presentationType}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="oral">Oral Presentation</option>
                        <option value="poster">Poster Presentation</option>
                        <option value="panel">Panel Discussion</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Track *
                      </label>
                      <select
                        name="track"
                        value={formData.track}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="general">General Hallyu Studies</option>
                        <option value="kpop">K-pop and Music</option>
                        <option value="drama">Korean Drama</option>
                        <option value="film">Korean Film</option>
                        <option value="culture">Korean Culture</option>
                        <option value="language">Korean Language</option>
                        <option value="business">Hallyu Business</option>
                        <option value="digital">Digital Hallyu</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0047A0' }}>Author Information</h3>
                  
                  <div style={{ padding: '15px', background: '#f0f0f0', borderRadius: '6px', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                      <strong>Your information:</strong><br />
                      Name: {user.user_metadata?.full_name || 'Not set'} • 
                      Email: {user.email} • 
                      <a href="/congress/register/profile" style={{ color: '#0047A0', marginLeft: '10px', textDecoration: 'underline' }}>
                        Update profile
                      </a>
                    </p>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                    Your name and email will be used as the primary author. 
                    If you need to add co-authors, please list them in the abstract text.
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      style={{ marginTop: '5px' }}
                    />
                    <label htmlFor="agreeToTerms" style={{ fontSize: '0.9rem' }}>
                      I agree to the terms and conditions. I confirm that this abstract is original work and has not been published elsewhere. I understand that all presenters must register for the conference if their abstract is accepted.
                    </label>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: submitting ? '#ccc' : '#CD2E3A',
                      color: 'white',
                      border: 'none',
                      padding: '12px 40px',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => {
                      if (!submitting) e.currentTarget.style.background = '#b0262e';
                    }}
                    onMouseOut={(e) => {
                      if (!submitting) e.currentTarget.style.background = '#CD2E3A';
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Abstract'}
                  </button>
                  
                  <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                    <p>
                      After submission, you can view and manage your abstracts in your{' '}
                      <a href="/congress/dashboard" style={{ color: '#0047A0', textDecoration: 'underline' }}>dashboard</a>.
                    </p>
                    <p style={{ marginTop: '5px' }}>
                      For questions, contact <a href="mailto:wahskorea@gmail.com" style={{ color: '#0047A0' }}>wahskorea@gmail.com</a>.
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
      
      <Footer />
      <ScrollReveal />
    </>
  );
}
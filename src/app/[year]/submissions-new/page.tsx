'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function SimpleSubmissionsPage({ params }: { params: { year: string } }) {
  const { year: yearStr } = params;
  const year = parseInt(yearStr);
  const [isValidYear, setIsValidYear] = useState(true);

  // Validate year
  if (isNaN(year) || year < 2000 || year > 2100) {
    setIsValidYear(false);
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

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    presentationType: 'oral',
    track: 'general',
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    country: '',
    bio: '',
    agreeToTerms: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      // Simple form submission
      const response = await fetch('/api/submit-abstract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      setSubmitSuccess(true);
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
              <p>Thank you for submitting your abstract. You will receive a confirmation email shortly.</p>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                <strong>Note:</strong> The committee will review all submissions and notify authors by April 15, {year}.
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
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="you@university.edu"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Affiliation
                    </label>
                    <input
                      type="text"
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="University, Institution, or Company"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      placeholder="Enter your country"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Brief Bio (optional)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                      placeholder="Brief professional biography (max 200 words)"
                    />
                  </div>
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
                  
                  <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                    After submission, you will receive a confirmation email. 
                    For questions, contact <a href="mailto:wahskorea@gmail.com" style={{ color: '#0047A0' }}>wahskorea@gmail.com</a>.
                  </p>
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
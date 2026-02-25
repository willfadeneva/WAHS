'use client';
import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

interface CoAuthor {
  name: string;
  email: string;
  affiliation: string;
}

export default function SubmissionForm({ year }: { year: number }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);

  const addCoAuthor = () => setCoAuthors([...coAuthors, { name: '', email: '', affiliation: '' }]);
  const removeCoAuthor = (i: number) => setCoAuthors(coAuthors.filter((_, idx) => idx !== i));
  const updateCoAuthor = (i: number, field: keyof CoAuthor, value: string) => {
    const updated = [...coAuthors];
    updated[i][field] = value;
    setCoAuthors(updated);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data = {
      type: form.get('type') as string,
      title: form.get('title') as string,
      track: form.get('track') as string,
      abstract: form.get('abstract') as string,
      keywords: form.get('keywords') as string,
      author_name: form.get('author_name') as string,
      author_email: form.get('author_email') as string,
      author_affiliation: form.get('author_affiliation') as string,
      author_bio: form.get('author_bio') as string,
      co_authors: coAuthors.filter(c => c.name.trim()),
      special_requirements: form.get('special_requirements') as string || '',
    };

    // Validate
    const required = ['type', 'title', 'track', 'abstract', 'keywords', 'author_name', 'author_email', 'author_affiliation', 'author_bio'];
    for (const field of required) {
      if (!data[field as keyof typeof data]) {
        setError(`Please fill in all required fields.`);
        setLoading(false);
        return;
      }
    }

    const { error: dbError } = await supabase.from('submissions').insert([{ ...data, congress_year: year }]);

    if (dbError) {
      setError('Submission failed. Please try again or email wahskorea@gmail.com.');
      console.error(dbError);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="submission-form-container">
        <div className="form-success">
          <div className="form-success-icon">✅</div>
          <h3>Submission Received!</h3>
          <p>Thank you for your submission to WAHS 2026. You will receive notification of acceptance by April 30, 2026.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-form-container">
      <div className="submission-form-header">
        <span className="section-label">Submission Form</span>
        <h3 className="submission-form-title">Submit Your Proposal</h3>
        <p className="submission-form-desc">Complete all fields below. Fields marked with * are required.</p>
      </div>
      <form onSubmit={handleSubmit} className="submission-form-body">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Submission Type <span className="required">*</span></label>
            <select name="type" className="form-select" required>
              <option value="">Select type...</option>
              <option value="individual_paper">Individual Paper (300–500 words)</option>
              <option value="full_panel">Full Panel (800–1,000 words)</option>
              <option value="roundtable">Roundtable (500–700 words)</option>
              <option value="workshop">Workshop (500–700 words)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Track <span className="required">*</span></label>
            <select name="track" className="form-select" required>
              <option value="">Select track...</option>
              <option value="cultural_dynamism">Track 1: Cultural Dynamism</option>
              <option value="open_topics">Track 2: Open Topics</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Title <span className="required">*</span></label>
          <input type="text" name="title" className="form-input" placeholder="Presentation or panel title" required />
        </div>

        <div className="form-group">
          <label className="form-label">Abstract <span className="required">*</span></label>
          <textarea name="abstract" className="form-textarea" placeholder="Your abstract..." required style={{ minHeight: '180px' }} />
          <p className="form-help">300–500 words for individual papers; 800–1,000 for panels; 500–700 for roundtables/workshops.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Keywords <span className="required">*</span></label>
          <input type="text" name="keywords" className="form-input" placeholder="5–7 keywords, comma separated" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Author Name <span className="required">*</span></label>
            <input type="text" name="author_name" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input type="email" name="author_email" className="form-input" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Affiliation <span className="required">*</span></label>
          <input type="text" name="author_affiliation" className="form-input" placeholder="University or institution" required />
        </div>

        <div className="form-group">
          <label className="form-label">Brief Bio <span className="required">*</span></label>
          <textarea name="author_bio" className="form-textarea" placeholder="100 words max" required />
        </div>

        {/* Co-authors */}
        <div className="form-group">
          <label className="form-label">Co-Authors</label>
          {coAuthors.map((ca, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--sand)', border: '1px solid var(--pearl)', marginBottom: '12px' }}>
              <div className="form-row">
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="Name" value={ca.name} onChange={e => updateCoAuthor(i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <input type="email" className="form-input" placeholder="Email" value={ca.email} onChange={e => updateCoAuthor(i, 'email', e.target.value)} />
                </div>
              </div>
              <div className="form-row" style={{ alignItems: 'center' }}>
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="Affiliation" value={ca.affiliation} onChange={e => updateCoAuthor(i, 'affiliation', e.target.value)} />
                </div>
                <button type="button" onClick={() => removeCoAuthor(i)} className="admin-btn admin-btn-secondary" style={{ alignSelf: 'flex-start', marginTop: 0 }}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addCoAuthor} className="admin-btn admin-btn-secondary">+ Add Co-Author</button>
        </div>

        <div className="form-group">
          <label className="form-label">Special Requirements</label>
          <textarea name="special_requirements" className="form-textarea" placeholder="AV needs, accessibility requirements, etc." style={{ minHeight: '80px' }} />
        </div>

        {error && <p className="form-error" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Abstract →'}
        </button>
      </form>
    </div>
  );
}

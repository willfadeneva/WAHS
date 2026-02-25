'use client';
import { useState, useRef, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CongressNav from '@/components/CongressNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

const TRACKS = [
  'Cultural Dynamism & Global Hallyu',
  'K-Pop & Popular Music Studies',
  'Korean Cinema & Media',
  'K-Drama & Television Studies',
  'Fashion, Beauty & K-Culture',
  'Korean Language & Education',
  'Tourism & Korean Cultural Heritage',
  'Policy, Industry & Creative Economy',
  'Digital Culture & Fan Studies',
  'Open Topics in Korean Studies',
];

const PRESENTATION_TYPES = [
  { value: 'individual_paper', label: 'Individual Paper' },
  { value: 'full_panel', label: 'Full Panel' },
  { value: 'roundtable', label: 'Roundtable' },
  { value: 'workshop', label: 'Workshop' },
];

type CoAuthor = { name: string; email: string; affiliation: string };

export default function SubmitAbstractPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [abstractLen, setAbstractLen] = useState(0);
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [pdfName, setPdfName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${year}/login`); return; }
      setUserEmail(user.email || '');
      const { data: member } = await supabase
        .from('wahs_members')
        .select('full_name, institution')
        .eq('user_id', user.id)
        .single();
      if (member) setUserName(member.full_name || '');
    }
    loadUser();
  }, [router, year]);

  function addCoAuthor() {
    setCoAuthors(prev => [...prev, { name: '', email: '', affiliation: '' }]);
  }

  function removeCoAuthor(idx: number) {
    setCoAuthors(prev => prev.filter((_, i) => i !== idx));
  }

  function updateCoAuthor(idx: number, field: keyof CoAuthor, value: string) {
    setCoAuthors(prev => prev.map((ca, i) => i === idx ? { ...ca, [field]: value } : ca));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const abstractText = form.get('abstract') as string;

    if (abstractText.length < 200) {
      setError('Abstract must be at least 200 characters.');
      setLoading(false);
      return;
    }

    // Build multipart form data
    const submitData = new FormData();
    submitData.append('title', form.get('title') as string);
    submitData.append('abstract', abstractText);
    submitData.append('keywords', form.get('keywords') as string);
    submitData.append('presentation_type', form.get('presentation_type') as string);
    submitData.append('track', form.get('track') as string);
    submitData.append('author_name', form.get('author_name') as string);
    submitData.append('author_email', form.get('author_email') as string);
    submitData.append('author_institution', form.get('author_institution') as string);
    submitData.append('author_bio', form.get('author_bio') as string);
    submitData.append('special_requirements', form.get('special_requirements') as string || '');
    submitData.append('co_authors', JSON.stringify(coAuthors));

    const pdfFile = fileRef.current?.files?.[0];
    if (pdfFile) {
      if (pdfFile.size > 5 * 1024 * 1024) {
        setError('PDF must be under 5MB.');
        setLoading(false);
        return;
      }
      submitData.append('pdf', pdfFile);
    }

    try {
      const res = await fetch(`/api/${year}/submissions`, {
        method: 'POST',
        body: submitData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        setLoading(false);
        return;
      }
      router.push(`/${year}/dashboard`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Submit Abstract</h1>
            <p className="main-page-subtitle">Congress {year} — Deadline: May 15, 2026</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
              <Link href={`/${year}/dashboard`} style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>
                ← Back to Dashboard
              </Link>
            </div>

            <div className="submission-form-container">
              <div className="submission-form-header">
                <h2 className="submission-form-title">Abstract Submission Form</h2>
                <p className="submission-form-desc">
                  All fields marked with <span style={{ color: 'var(--coral)' }}>*</span> are required.
                  Abstract minimum: 200 characters.
                </p>
              </div>
              <div className="submission-form-body">
                <form onSubmit={handleSubmit}>
                  {/* Author Info */}
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--navy)', marginBottom: 16 }}>
                    Author Information
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name <span className="required">*</span></label>
                      <input type="text" name="author_name" className="form-input" defaultValue={userName} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email <span className="required">*</span></label>
                      <input type="email" name="author_email" className="form-input" defaultValue={userEmail} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution / Affiliation <span className="required">*</span></label>
                    <input type="text" name="author_institution" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Bio <span className="required">*</span></label>
                    <textarea name="author_bio" className="form-textarea" rows={3} required
                      placeholder="Brief professional biography (50–150 words)" />
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />

                  {/* Submission Details */}
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--navy)', marginBottom: 16 }}>
                    Submission Details
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Title <span className="required">*</span></label>
                    <input type="text" name="title" className="form-input" required
                      placeholder="Full title of your paper/panel" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Abstract <span className="required">*</span>
                      <span style={{ fontWeight: 400, color: abstractLen < 200 ? 'var(--coral)' : 'var(--teal)', marginLeft: 8 }}>
                        ({abstractLen} / 200 min)
                      </span>
                    </label>
                    <textarea
                      name="abstract"
                      className="form-textarea"
                      rows={8}
                      required
                      placeholder="Minimum 200 characters. Summarize your research, methodology, and findings."
                      onChange={e => setAbstractLen(e.target.value.length)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Keywords <span className="required">*</span></label>
                    <input type="text" name="keywords" className="form-input" required
                      placeholder="e.g. K-pop, diaspora, cultural identity (comma-separated)" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Presentation Type <span className="required">*</span></label>
                      <select name="presentation_type" className="form-select" required>
                        <option value="">Select type…</option>
                        {PRESENTATION_TYPES.map(pt => (
                          <option key={pt.value} value={pt.value}>{pt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Track <span className="required">*</span></label>
                      <select name="track" className="form-select" required>
                        <option value="">Select track…</option>
                        {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Co-Authors */}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--navy)', margin: 0 }}>
                      Co-Authors (Optional)
                    </h3>
                    <button type="button" onClick={addCoAuthor}
                      style={{ padding: '6px 14px', background: 'var(--kr-blue)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      + Add Co-Author
                    </button>
                  </div>
                  {coAuthors.map((ca, idx) => (
                    <div key={idx} style={{ padding: 16, background: 'var(--sand)', borderRadius: 4, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <strong style={{ fontSize: '0.9rem' }}>Co-Author {idx + 1}</strong>
                        <button type="button" onClick={() => removeCoAuthor(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Remove
                        </button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-input" value={ca.name}
                            onChange={e => updateCoAuthor(idx, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-input" value={ca.email}
                            onChange={e => updateCoAuthor(idx, 'email', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Affiliation</label>
                        <input type="text" className="form-input" value={ca.affiliation}
                          onChange={e => updateCoAuthor(idx, 'affiliation', e.target.value)} />
                      </div>
                    </div>
                  ))}

                  {/* PDF Upload */}
                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />
                  <div className="form-group">
                    <label className="form-label">PDF Upload (Optional)</label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className="form-input"
                      style={{ padding: '8px 12px' }}
                      onChange={e => setPdfName(e.target.files?.[0]?.name || '')}
                    />
                    <p className="form-help">Maximum 5MB. Full paper or extended abstract in PDF format.</p>
                    {pdfName && <p style={{ fontSize: '0.85rem', color: 'var(--teal)', marginTop: 4 }}>Selected: {pdfName}</p>}
                  </div>

                  {/* Special Requirements */}
                  <div className="form-group">
                    <label className="form-label">Special Requirements (Optional)</label>
                    <textarea name="special_requirements" className="form-textarea" rows={3}
                      placeholder="AV equipment, accessibility needs, scheduling constraints, etc." />
                  </div>

                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1, marginTop: 8 }}
                  >
                    {loading ? 'Submitting…' : 'Submit Abstract →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';
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

type Submission = {
  id: string;
  title: string;
  abstract: string;
  keywords: string;
  presentation_type: string;
  track: string;
  author_name: string;
  author_email: string;
  author_institution: string;
  author_bio: string;
  co_authors: CoAuthor[];
  special_requirements: string;
  pdf_url: string | null;
  status: string;
};

export default function EditSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const id = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');
  const [abstractLen, setAbstractLen] = useState(0);
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [pdfName, setPdfName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/congress/${year}/login`); return; }

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !data) {
        router.push(`/congress/${year}/dashboard`);
        return;
      }
      setSubmission(data as Submission);
      setCoAuthors(data.co_authors || []);
      setAbstractLen(data.abstract?.length || 0);
      setLoading(false);
    }
    load();
  }, [id, year, router]);

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
    setSaving(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const abstractText = form.get('abstract') as string;

    if (abstractText.length < 200) {
      setError('Abstract must be at least 200 characters.');
      setSaving(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('id', id);
    submitData.append('title', form.get('title') as string);
    submitData.append('abstract', abstractText);
    submitData.append('keywords', form.get('keywords') as string);
    submitData.append('presentation_type', form.get('presentation_type') as string);
    submitData.append('track', form.get('track') as string);
    submitData.append('author_name', form.get('author_name') as string);
    submitData.append('author_institution', form.get('author_institution') as string);
    submitData.append('author_bio', form.get('author_bio') as string);
    submitData.append('special_requirements', form.get('special_requirements') as string || '');
    submitData.append('co_authors', JSON.stringify(coAuthors));

    const pdfFile = fileRef.current?.files?.[0];
    if (pdfFile) {
      if (pdfFile.size > 5 * 1024 * 1024) {
        setError('PDF must be under 5MB.');
        setSaving(false);
        return;
      }
      submitData.append('pdf', pdfFile);
    }

    try {
      const res = await fetch(`/api/congress/${year}/submissions`, {
        method: 'PATCH',
        body: submitData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Update failed. Please try again.');
        setSaving(false);
        return;
      }
      router.push(`/congress/${year}/dashboard`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  async function handleWithdraw() {
    if (!confirm('Are you sure you want to withdraw this submission? This cannot be undone.')) return;
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/congress/${year}/submissions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        router.push(`/congress/${year}/dashboard`);
      } else {
        const data = await res.json();
        setError(data.error || 'Withdrawal failed.');
      }
    } catch {
      setError('Something went wrong.');
    }
    setWithdrawing(false);
  }

  if (loading) {
    return (
      <div className="main-page">
        <CongressNav year={year} />
        <main className="main-content">
          <section className="main-content-section">
            <div style={{ textAlign: 'center', padding: '60px 0' }}><p>Loading submission…</p></div>
          </section>
        </main>
        <MainFooter />
      </div>
    );
  }

  if (!submission) return null;

  return (
    <div className="main-page">
      <CongressNav year={year} />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">Edit Submission</h1>
            <p className="main-page-subtitle">Congress {year}</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <Link href={`/congress/${year}/dashboard`} style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>
                ← Back to Dashboard
              </Link>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={withdrawing || submission.status === 'withdrawn'}
                style={{
                  padding: '8px 20px', background: '#ef4444', color: '#fff', border: 'none',
                  borderRadius: 4, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  opacity: withdrawing || submission.status === 'withdrawn' ? 0.5 : 1,
                }}
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw Submission'}
              </button>
            </div>

            {submission.status === 'withdrawn' && (
              <div style={{ padding: 16, background: '#fee2e2', borderRadius: 4, marginBottom: 16, color: '#991b1b', fontSize: '0.9rem' }}>
                This submission has been withdrawn and cannot be edited.
              </div>
            )}

            <div className="submission-form-container">
              <div className="submission-form-header">
                <h2 className="submission-form-title">Edit Abstract</h2>
                <p className="submission-form-desc">Update your submission details below.</p>
              </div>
              <div className="submission-form-body">
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--navy)', marginBottom: 16 }}>
                    Author Information
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name <span className="required">*</span></label>
                      <input type="text" name="author_name" className="form-input" defaultValue={submission.author_name} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" value={submission.author_email} disabled
                        style={{ background: '#f5f5f5', cursor: 'not-allowed', color: 'var(--mist)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution <span className="required">*</span></label>
                    <input type="text" name="author_institution" className="form-input" defaultValue={submission.author_institution} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Bio</label>
                    <textarea name="author_bio" className="form-textarea" rows={3} defaultValue={submission.author_bio} />
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />

                  <div className="form-group">
                    <label className="form-label">Title <span className="required">*</span></label>
                    <input type="text" name="title" className="form-input" defaultValue={submission.title} required />
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
                      defaultValue={submission.abstract}
                      onChange={e => setAbstractLen(e.target.value.length)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Keywords <span className="required">*</span></label>
                    <input type="text" name="keywords" className="form-input" defaultValue={submission.keywords} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Presentation Type <span className="required">*</span></label>
                      <select name="presentation_type" className="form-select" defaultValue={submission.presentation_type} required>
                        {PRESENTATION_TYPES.map(pt => (
                          <option key={pt.value} value={pt.value}>{pt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Track <span className="required">*</span></label>
                      <select name="track" className="form-select" defaultValue={submission.track} required>
                        {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--navy)', margin: 0 }}>
                      Co-Authors
                    </h3>
                    <button type="button" onClick={addCoAuthor}
                      style={{ padding: '6px 14px', background: 'var(--kr-blue)', color: '#fff', border: 'none', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      + Add
                    </button>
                  </div>
                  {coAuthors.map((ca, idx) => (
                    <div key={idx} style={{ padding: 16, background: 'var(--sand)', borderRadius: 4, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <strong style={{ fontSize: '0.9rem' }}>Co-Author {idx + 1}</strong>
                        <button type="button" onClick={() => removeCoAuthor(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-input" value={ca.name} onChange={e => updateCoAuthor(idx, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-input" value={ca.email} onChange={e => updateCoAuthor(idx, 'email', e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Affiliation</label>
                        <input type="text" className="form-input" value={ca.affiliation} onChange={e => updateCoAuthor(idx, 'affiliation', e.target.value)} />
                      </div>
                    </div>
                  ))}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--pearl)', margin: '24px 0' }} />
                  <div className="form-group">
                    <label className="form-label">Replace PDF (Optional)</label>
                    {submission.pdf_url && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--teal)', marginBottom: 8 }}>
                        Current PDF: <a href={submission.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--kr-blue)' }}>View file</a>
                      </p>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className="form-input"
                      style={{ padding: '8px 12px' }}
                      onChange={e => setPdfName(e.target.files?.[0]?.name || '')}
                    />
                    <p className="form-help">Upload a new PDF to replace the existing one. Max 5MB.</p>
                    {pdfName && <p style={{ fontSize: '0.85rem', color: 'var(--teal)', marginTop: 4 }}>New file: {pdfName}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Requirements</label>
                    <textarea name="special_requirements" className="form-textarea" rows={3} defaultValue={submission.special_requirements} />
                  </div>

                  {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving || submission.status === 'withdrawn'}
                    style={{ width: '100%', justifyContent: 'center', opacity: saving || submission.status === 'withdrawn' ? 0.6 : 1 }}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
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

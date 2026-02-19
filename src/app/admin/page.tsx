'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type Submission = {
  id: string; type: string; title: string; track: string; abstract: string; keywords: string;
  author_name: string; author_email: string; author_affiliation: string; author_bio: string;
  co_authors: { name: string; email: string; affiliation: string }[];
  special_requirements: string; status: string; submitted_at: string; reviewed_at: string | null; reviewer_notes: string;
};

type Speaker = {
  id: string; name: string; role: string; affiliation: string; image_url: string; bio: string; sort_order: number; is_plenary: boolean;
};

type Registration = {
  id: string; name: string; email: string; affiliation: string; country: string;
  registration_type: string; payment_status: string; payment_date: string | null;
  congress_year: number; created_at: string; notes: string;
};

type Member = {
  id: string; name: string; email: string; affiliation: string; country: string;
  membership_type: string; payment_status: string; payment_date: string | null;
  year: number; created_at: string; notes: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'submissions' | 'speakers' | 'registrations' | 'members'>('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRegYear, setFilterRegYear] = useState('');
  const [filterRegStatus, setFilterRegStatus] = useState('');
  const [filterMemYear, setFilterMemYear] = useState('');
  const [filterMemStatus, setFilterMemStatus] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  const ALLOWED_ADMINS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && ALLOWED_ADMINS.includes(data.user.email || '')) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const fetchSubmissions = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (filterTrack) params.set('track', filterTrack);
    if (filterType) params.set('type', filterType);
    const res = await fetch(`/api/admin/submissions?${params}`);
    setSubmissions(await res.json());
  }, [filterStatus, filterTrack, filterType]);

  const fetchSpeakers = async () => {
    const res = await fetch('/api/admin/speakers');
    setSpeakers(await res.json());
  };

  const fetchRegistrations = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterRegYear) params.set('year', filterRegYear);
    if (filterRegStatus) params.set('status', filterRegStatus);
    const res = await fetch(`/api/registrations?${params}`);
    setRegistrations(await res.json());
  }, [filterRegYear, filterRegStatus]);

  const fetchMembers = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterMemYear) params.set('year', filterMemYear);
    if (filterMemStatus) params.set('status', filterMemStatus);
    const res = await fetch(`/api/members?${params}`);
    setMembers(await res.json());
  }, [filterMemYear, filterMemStatus]);

  useEffect(() => { if (user) { fetchSubmissions(); fetchSpeakers(); } }, [user, fetchSubmissions]);
  useEffect(() => { if (user && tab === 'registrations') fetchRegistrations(); }, [user, tab, fetchRegistrations]);
  useEffect(() => { if (user && tab === 'members') fetchMembers(); }, [user, tab, fetchMembers]);

  const login = async () => {
    setLoginError('');
    if (!ALLOWED_ADMINS.includes(email.toLowerCase())) { setLoginError('Access denied'); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoginError(error.message); return; }
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  const updateSubmissionStatus = async (id: string, status: string) => {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewer_notes: reviewerNotes }),
    });
    fetchSubmissions();
    setSelectedSubmission(null);
  };

  const updateRegStatus = async (id: string, payment_status: string) => {
    await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status }),
    });
    fetchRegistrations();
  };

  const updateMemStatus = async (id: string, payment_status: string) => {
    await fetch(`/api/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status }),
    });
    fetchMembers();
  };

  const saveSpeaker = async (formData: FormData) => {
    const body: Record<string, unknown> = {
      name: formData.get('name'),
      role: formData.get('role'),
      affiliation: formData.get('affiliation'),
      image_url: formData.get('image_url'),
      bio: formData.get('bio'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    };
    if (editingSpeaker) body.id = editingSpeaker.id;

    await fetch('/api/admin/speakers', {
      method: editingSpeaker ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchSpeakers();
    setShowSpeakerModal(false);
    setEditingSpeaker(null);
  };

  const deleteSpeaker = async (id: string) => {
    if (!confirm('Delete this speaker?')) return;
    await fetch('/api/admin/speakers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSpeakers();
  };

  if (loading) return <div className="admin-login"><div className="admin-login-card"><p>Loading...</p></div></div>;

  if (!user) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h2>WAHS 2026 Admin</h2>
          <p>Sign in to manage submissions, registrations, and members.</p>
          {loginError && <p className="form-error" style={{ marginBottom: 16 }}>{loginError}</p>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <button onClick={login} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign In</button>
        </div>
      </div>
    );
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    revision: submissions.filter(s => s.status === 'revision').length,
  };

  const regStats = {
    total: registrations.length,
    pending: registrations.filter(r => r.payment_status === 'pending').length,
    confirmed: registrations.filter(r => r.payment_status === 'confirmed').length,
  };

  const memStats = {
    total: members.length,
    pending: members.filter(m => m.payment_status === 'pending').length,
    confirmed: members.filter(m => m.payment_status === 'confirmed').length,
  };

  const typeLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      pending: { bg: '#fef3c7', color: '#92400e' },
      confirmed: { bg: '#d1fae5', color: '#065f46' },
      rejected: { bg: '#fee2e2', color: '#991b1b' },
    };
    const s = colors[status] || { bg: '#f3f4f6', color: '#374151' };
    return (
      <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 600, background: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1>WAHS 2026 Admin</h1>
        <button onClick={logout} className="admin-btn admin-btn-secondary">Logout</button>
      </div>
      <div className="admin-content">
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>Dashboard</button>
          <button className={`admin-tab ${tab === 'submissions' ? 'active' : ''}`} onClick={() => { setTab('submissions'); fetchSubmissions(); }}>Submissions</button>
          <button className={`admin-tab ${tab === 'registrations' ? 'active' : ''}`} onClick={() => setTab('registrations')}>Registrations</button>
          <button className={`admin-tab ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>Members</button>
          <button className={`admin-tab ${tab === 'speakers' ? 'active' : ''}`} onClick={() => { setTab('speakers'); fetchSpeakers(); }}>Speakers</button>
        </div>

        {tab === 'dashboard' && (
          <>
            <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#666' }}>Submissions</h3>
            <div className="admin-stats">
              <div className="admin-stat-card"><div className="admin-stat-label">Total</div><div className="admin-stat-value">{stats.total}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Pending</div><div className="admin-stat-value">{stats.pending}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Accepted</div><div className="admin-stat-value">{stats.accepted}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Revision</div><div className="admin-stat-value">{stats.revision}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Rejected</div><div className="admin-stat-value">{stats.rejected}</div></div>
            </div>
            <h3 style={{ margin: '24px 0 12px', fontSize: '1rem', color: '#666' }}>Registrations</h3>
            <div className="admin-stats">
              <div className="admin-stat-card"><div className="admin-stat-label">Total</div><div className="admin-stat-value">{regStats.total}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Pending</div><div className="admin-stat-value">{regStats.pending}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Confirmed</div><div className="admin-stat-value">{regStats.confirmed}</div></div>
            </div>
            <h3 style={{ margin: '24px 0 12px', fontSize: '1rem', color: '#666' }}>Members</h3>
            <div className="admin-stats">
              <div className="admin-stat-card"><div className="admin-stat-label">Total</div><div className="admin-stat-value">{memStats.total}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Pending</div><div className="admin-stat-value">{memStats.pending}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Confirmed</div><div className="admin-stat-value">{memStats.confirmed}</div></div>
            </div>
          </>
        )}

        {tab === 'registrations' && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterRegYear} onChange={e => setFilterRegYear(e.target.value)}>
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <select className="admin-filter-select" value={filterRegStatus} onChange={e => setFilterRegStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchRegistrations}>Filter</button>
            </div>
            <div style={{ marginBottom: 16, fontSize: '0.9rem', color: '#666' }}>
              Total: {regStats.total} · Pending: {regStats.pending} · Confirmed: {regStats.confirmed}
            </div>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Country</th><th>Year</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {registrations.map(r => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{typeLabel(r.registration_type)}</td>
                    <td>{r.country || '—'}</td>
                    <td>{r.congress_year}</td>
                    <td>{statusBadge(r.payment_status)}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.payment_status !== 'confirmed' && (
                          <button className="admin-btn admin-btn-teal" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => updateRegStatus(r.id, 'confirmed')}>Confirm</button>
                        )}
                        {r.payment_status !== 'rejected' && (
                          <button className="admin-btn" style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => updateRegStatus(r.id, 'rejected')}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>No registrations found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'members' && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterMemYear} onChange={e => setFilterMemYear(e.target.value)}>
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <select className="admin-filter-select" value={filterMemStatus} onChange={e => setFilterMemStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchMembers}>Filter</button>
            </div>
            <div style={{ marginBottom: 16, fontSize: '0.9rem', color: '#666' }}>
              Total: {memStats.total} · Pending: {memStats.pending} · Confirmed: {memStats.confirmed}
            </div>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Affiliation</th><th>Country</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{typeLabel(m.membership_type)}</td>
                    <td>{m.affiliation || '—'}</td>
                    <td>{m.country || '—'}</td>
                    <td>{m.year}</td>
                    <td>{statusBadge(m.payment_status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {m.payment_status !== 'confirmed' && (
                          <button className="admin-btn admin-btn-teal" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => updateMemStatus(m.id, 'confirmed')}>Confirm</button>
                        )}
                        {m.payment_status !== 'rejected' && (
                          <button className="admin-btn" style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => updateMemStatus(m.id, 'rejected')}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>No members found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'submissions' && !selectedSubmission && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="revision">Revision</option>
              </select>
              <select className="admin-filter-select" value={filterTrack} onChange={e => setFilterTrack(e.target.value)}>
                <option value="">All Tracks</option>
                <option value="cultural_dynamism">Cultural Dynamism</option>
                <option value="open_topics">Open Topics</option>
              </select>
              <select className="admin-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="individual_paper">Individual Paper</option>
                <option value="full_panel">Full Panel</option>
                <option value="roundtable">Roundtable</option>
                <option value="workshop">Workshop</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchSubmissions}>Filter</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Author</th><th>Type</th><th>Track</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} onClick={() => { setSelectedSubmission(s); setReviewerNotes(s.reviewer_notes || ''); }} style={{ cursor: 'pointer' }}>
                    <td>{s.title}</td>
                    <td>{s.author_name}</td>
                    <td>{typeLabel(s.type)}</td>
                    <td>{typeLabel(s.track)}</td>
                    <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                    <td>{new Date(s.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {submissions.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>No submissions found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'submissions' && selectedSubmission && (
          <div className="admin-detail">
            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedSubmission(null)} style={{ marginBottom: 24 }}>← Back</button>
            <h2>{selectedSubmission.title}</h2>
            <div className="admin-detail-grid">
              <div className="admin-detail-label">Status</div>
              <div><span className={`status-badge ${selectedSubmission.status}`}>{selectedSubmission.status}</span></div>
              <div className="admin-detail-label">Type</div><div className="admin-detail-value">{typeLabel(selectedSubmission.type)}</div>
              <div className="admin-detail-label">Track</div><div className="admin-detail-value">{typeLabel(selectedSubmission.track)}</div>
              <div className="admin-detail-label">Author</div><div className="admin-detail-value">{selectedSubmission.author_name}</div>
              <div className="admin-detail-label">Email</div><div className="admin-detail-value">{selectedSubmission.author_email}</div>
              <div className="admin-detail-label">Affiliation</div><div className="admin-detail-value">{selectedSubmission.author_affiliation}</div>
              <div className="admin-detail-label">Bio</div><div className="admin-detail-value">{selectedSubmission.author_bio}</div>
              <div className="admin-detail-label">Keywords</div><div className="admin-detail-value">{selectedSubmission.keywords}</div>
              <div className="admin-detail-label">Abstract</div><div className="admin-detail-value" style={{ whiteSpace: 'pre-wrap' }}>{selectedSubmission.abstract}</div>
              {selectedSubmission.co_authors?.length > 0 && (
                <><div className="admin-detail-label">Co-Authors</div>
                <div className="admin-detail-value">{selectedSubmission.co_authors.map((c, i) => <div key={i}>{c.name} ({c.affiliation}) — {c.email}</div>)}</div></>
              )}
              {selectedSubmission.special_requirements && (
                <><div className="admin-detail-label">Special Req.</div><div className="admin-detail-value">{selectedSubmission.special_requirements}</div></>
              )}
              <div className="admin-detail-label">Submitted</div><div className="admin-detail-value">{new Date(selectedSubmission.submitted_at).toLocaleString()}</div>
            </div>
            <div style={{ marginTop: 32 }}>
              <div className="form-group">
                <label className="form-label">Reviewer Notes</label>
                <textarea className="form-textarea" value={reviewerNotes} onChange={e => setReviewerNotes(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="admin-btn admin-btn-teal" onClick={() => updateSubmissionStatus(selectedSubmission.id, 'accepted')}>Accept</button>
                <button className="admin-btn admin-btn-secondary" onClick={() => updateSubmissionStatus(selectedSubmission.id, 'revision')}>Request Revision</button>
                <button className="admin-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'speakers' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <button className="admin-btn admin-btn-primary" onClick={() => { setEditingSpeaker(null); setShowSpeakerModal(true); }}>+ Add Speaker</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Role</th><th>Affiliation</th><th>Order</th><th>Actions</th></tr></thead>
                <tbody>
                  {speakers.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.role}</td>
                      <td>{s.affiliation}</td>
                      <td>{s.sort_order}</td>
                      <td>
                        <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8 }} onClick={() => { setEditingSpeaker(s); setShowSpeakerModal(true); }}>Edit</button>
                        <button className="admin-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => deleteSpeaker(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showSpeakerModal && (
          <div className="admin-modal-overlay" onClick={() => setShowSpeakerModal(false)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', marginBottom: 24 }}>
                {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
              </h2>
              <form onSubmit={e => { e.preventDefault(); saveSpeaker(new FormData(e.currentTarget)); }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input name="name" className="form-input" defaultValue={editingSpeaker?.name} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input name="role" className="form-input" defaultValue={editingSpeaker?.role || 'Keynote'} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input name="sort_order" type="number" className="form-input" defaultValue={editingSpeaker?.sort_order || 0} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Affiliation</label>
                  <input name="affiliation" className="form-input" defaultValue={editingSpeaker?.affiliation} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input name="image_url" className="form-input" defaultValue={editingSpeaker?.image_url} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea name="bio" className="form-textarea" defaultValue={editingSpeaker?.bio} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="admin-btn admin-btn-primary">Save</button>
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowSpeakerModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

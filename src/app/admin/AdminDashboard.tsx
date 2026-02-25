'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

type Submission = {
  id: string;
  congress_year: number;
  presentation_type: string;
  title: string;
  track: string;
  abstract: string;
  keywords: string;
  author_name: string;
  author_email: string;
  author_institution: string;
  author_bio: string;
  co_authors: { name: string; email: string; affiliation: string }[];
  special_requirements: string;
  status: string;
  submitted_at: string;
  reviewer_notes: string;
  pdf_url: string | null;
};

type Member = {
  id: string;
  full_name: string;
  email: string;
  institution: string | null;
  country: string | null;
  membership_type: string;
  membership_status: string;
  joined_at: string;
};

type Registration = {
  id: string;
  congress_year: number;
  email: string;
  full_name: string;
  institution: string | null;
  country: string | null;
  ticket_type: string;
  amount_paid: number;
  registered_at: string;
};

type Speaker = {
  id: string; name: string; role: string; affiliation: string; image_url: string; bio: string; sort_order: number;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    active: { bg: '#d1fae5', color: '#065f46' },
    accepted: { bg: '#d1fae5', color: '#065f46' },
    under_review: { bg: '#dbeafe', color: '#1e40af' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    withdrawn: { bg: '#f3f4f6', color: '#6b7280' },
    expired: { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 700, background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'dashboard' | 'submissions' | 'members' | 'registrations' | 'speakers'>('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [filterSubStatus, setFilterSubStatus] = useState('');
  const [filterSubYear, setFilterSubYear] = useState('');
  const [filterMemStatus, setFilterMemStatus] = useState('');
  const [filterMemType, setFilterMemType] = useState('');
  const [filterRegYear, setFilterRegYear] = useState('');
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [editSpeaker, setEditSpeaker] = useState<Speaker | null>(null);
  const [loadingAction, setLoadingAction] = useState('');

  const fetchSubmissions = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterSubStatus) params.set('status', filterSubStatus);
    if (filterSubYear) params.set('year', filterSubYear);
    const res = await fetch(`/api/admin/submissions?${params}`);
    if (res.ok) setSubmissions(await res.json());
  }, [filterSubStatus, filterSubYear]);

  const fetchMembers = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterMemStatus) params.set('status', filterMemStatus);
    if (filterMemType) params.set('type', filterMemType);
    const res = await fetch(`/api/admin/members?${params}`);
    if (res.ok) setMembers(await res.json());
  }, [filterMemStatus, filterMemType]);

  const fetchRegistrations = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterRegYear) params.set('year', filterRegYear);
    const res = await fetch(`/api/registrations?${params}`);
    if (res.ok) setRegistrations(await res.json());
  }, [filterRegYear]);

  const fetchSpeakers = async () => {
    const res = await fetch('/api/admin/speakers');
    if (res.ok) setSpeakers(await res.json());
  };

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);
  useEffect(() => { if (tab === 'members') fetchMembers(); }, [tab, fetchMembers]);
  useEffect(() => { if (tab === 'registrations') fetchRegistrations(); }, [tab, fetchRegistrations]);
  useEffect(() => { if (tab === 'speakers') fetchSpeakers(); }, [tab]);

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/admin/login'; };

  const updateSubStatus = async (id: string, status: string) => {
    setLoadingAction(id + status);
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewer_notes: reviewerNotes }),
    });
    setSelectedSub(null);
    await fetchSubmissions();
    setLoadingAction('');
  };

  const updateMemberStatus = async (id: string, membership_status: string) => {
    setLoadingAction(id);
    await fetch('/api/admin/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, membership_status }),
    });
    await fetchMembers();
    setLoadingAction('');
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
    if (editSpeaker) body.id = editSpeaker.id;
    await fetch('/api/admin/speakers', {
      method: editSpeaker ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchSpeakers();
    setShowSpeakerModal(false);
    setEditSpeaker(null);
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

  const exportCSV = (data: Record<string, unknown>[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const typeLabel = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';

  const stats = {
    totalSubs: submissions.length,
    pendingSubs: submissions.filter(s => s.status === 'pending').length,
    acceptedSubs: submissions.filter(s => s.status === 'accepted').length,
    acceptanceRate: submissions.length > 0
      ? Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.filter(s => ['accepted', 'rejected'].includes(s.status)).length) * 100) || 0
      : 0,
  };

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1>WAHS Admin Dashboard</h1>
        <button onClick={logout} className="admin-btn admin-btn-secondary">Logout</button>
      </div>
      <div className="admin-content">
        <div className="admin-tabs">
          {(['dashboard', 'submissions', 'members', 'registrations', 'speakers'] as const).map(t => (
            <button
              key={t}
              className={`admin-tab ${tab === t ? 'active' : ''}`}
              onClick={() => { setTab(t); if (t === 'submissions') fetchSubmissions(); }}
            >
              {typeLabel(t)}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <>
            <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#666' }}>Submissions Overview</h3>
            <div className="admin-stats">
              <div className="admin-stat-card"><div className="admin-stat-label">Total Submissions</div><div className="admin-stat-value">{stats.totalSubs}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Pending Review</div><div className="admin-stat-value">{stats.pendingSubs}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Accepted</div><div className="admin-stat-value">{stats.acceptedSubs}</div></div>
              <div className="admin-stat-card"><div className="admin-stat-label">Acceptance Rate</div><div className="admin-stat-value">{stats.acceptanceRate}%</div></div>
            </div>
          </>
        )}

        {/* Submissions Tab */}
        {tab === 'submissions' && !selectedSub && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterSubYear} onChange={e => setFilterSubYear(e.target.value)}>
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <select className="admin-filter-select" value={filterSubStatus} onChange={e => setFilterSubStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchSubmissions}>Filter</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => exportCSV(submissions as unknown as Record<string, unknown>[], 'submissions.csv')}>Export CSV</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th><th>Author</th><th>Year</th><th>Type</th><th>Track</th><th>Status</th><th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} onClick={() => { setSelectedSub(s); setReviewerNotes(s.reviewer_notes || ''); }} style={{ cursor: 'pointer' }}>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</td>
                    <td>{s.author_name}</td>
                    <td>{s.congress_year}</td>
                    <td>{typeLabel(s.presentation_type)}</td>
                    <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.track}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>{new Date(s.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {submissions.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>No submissions found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Submission Detail */}
        {tab === 'submissions' && selectedSub && (
          <div className="admin-detail">
            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedSub(null)} style={{ marginBottom: 24 }}>← Back to List</button>
            <h2>{selectedSub.title}</h2>
            <div className="admin-detail-grid">
              <div className="admin-detail-label">Status</div><div><StatusBadge status={selectedSub.status} /></div>
              <div className="admin-detail-label">Year</div><div className="admin-detail-value">{selectedSub.congress_year}</div>
              <div className="admin-detail-label">Type</div><div className="admin-detail-value">{typeLabel(selectedSub.presentation_type)}</div>
              <div className="admin-detail-label">Track</div><div className="admin-detail-value">{selectedSub.track}</div>
              <div className="admin-detail-label">Author</div><div className="admin-detail-value">{selectedSub.author_name}</div>
              <div className="admin-detail-label">Email</div><div className="admin-detail-value">{selectedSub.author_email}</div>
              <div className="admin-detail-label">Affiliation</div><div className="admin-detail-value">{selectedSub.author_institution}</div>
              <div className="admin-detail-label">Bio</div><div className="admin-detail-value" style={{ whiteSpace: 'pre-wrap' }}>{selectedSub.author_bio}</div>
              <div className="admin-detail-label">Keywords</div><div className="admin-detail-value">{selectedSub.keywords}</div>
              <div className="admin-detail-label">Abstract</div><div className="admin-detail-value" style={{ whiteSpace: 'pre-wrap' }}>{selectedSub.abstract}</div>
              {selectedSub.co_authors?.length > 0 && (
                <><div className="admin-detail-label">Co-Authors</div>
                <div className="admin-detail-value">{selectedSub.co_authors.map((c, i) => <div key={i}>{c.name} ({c.affiliation}) — {c.email}</div>)}</div></>
              )}
              {selectedSub.special_requirements && (
                <><div className="admin-detail-label">Special Req.</div><div className="admin-detail-value">{selectedSub.special_requirements}</div></>
              )}
              {selectedSub.pdf_url && (
                <><div className="admin-detail-label">PDF</div>
                <div className="admin-detail-value"><a href={selectedSub.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--kr-blue)' }}>View PDF</a></div></>
              )}
              <div className="admin-detail-label">Submitted</div><div className="admin-detail-value">{new Date(selectedSub.submitted_at).toLocaleString()}</div>
            </div>
            <div style={{ marginTop: 32 }}>
              <div className="form-group">
                <label className="form-label">Reviewer Notes</label>
                <textarea className="form-textarea" value={reviewerNotes} onChange={e => setReviewerNotes(e.target.value)}
                  placeholder="Internal notes for reviewers (will be sent to author on status change)" />
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-teal" disabled={!!loadingAction}
                  onClick={() => updateSubStatus(selectedSub.id, 'accepted')}>Accept</button>
                <button className="admin-btn admin-btn-secondary" disabled={!!loadingAction}
                  onClick={() => updateSubStatus(selectedSub.id, 'under_review')}>Mark Under Review</button>
                <button className="admin-btn" style={{ background: '#f59e0b', color: '#fff' }} disabled={!!loadingAction}
                  onClick={() => updateSubStatus(selectedSub.id, 'under_review')}>Under Review</button>
                <button className="admin-btn" style={{ background: '#ef4444', color: '#fff' }} disabled={!!loadingAction}
                  onClick={() => updateSubStatus(selectedSub.id, 'rejected')}>Reject</button>
              </div>
              {loadingAction && <p style={{ fontSize: '0.85rem', color: 'var(--mist)', marginTop: 8 }}>Updating…</p>}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {tab === 'members' && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterMemStatus} onChange={e => setFilterMemStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <select className="admin-filter-select" value={filterMemType} onChange={e => setFilterMemType(e.target.value)}>
                <option value="">All Types</option>
                <option value="professional">Professional</option>
                <option value="student">Student</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchMembers}>Filter</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => exportCSV(members as unknown as Record<string, unknown>[], 'members.csv')}>Export CSV</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Type</th><th>Institution</th><th>Country</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td>{m.full_name}</td>
                    <td>{m.email}</td>
                    <td>{typeLabel(m.membership_type)}</td>
                    <td>{m.institution || '—'}</td>
                    <td>{m.country || '—'}</td>
                    <td><StatusBadge status={m.membership_status} /></td>
                    <td>{new Date(m.joined_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {m.membership_status !== 'active' && (
                          <button className="admin-btn admin-btn-teal"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            disabled={loadingAction === m.id}
                            onClick={() => updateMemberStatus(m.id, 'active')}>Activate</button>
                        )}
                        {m.membership_status === 'active' && (
                          <button className="admin-btn"
                            style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '4px 10px' }}
                            disabled={loadingAction === m.id}
                            onClick={() => updateMemberStatus(m.id, 'expired')}>Deactivate</button>
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

        {/* Registrations Tab */}
        {tab === 'registrations' && (
          <div className="admin-table-wrap">
            <div className="admin-filters">
              <select className="admin-filter-select" value={filterRegYear} onChange={e => setFilterRegYear(e.target.value)}>
                <option value="">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <button className="admin-btn admin-btn-primary" onClick={fetchRegistrations}>Filter</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => exportCSV(registrations as unknown as Record<string, unknown>[], 'registrations.csv')}>Export CSV</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Year</th><th>Ticket</th><th>Amount</th><th>Country</th><th>Registered</th></tr>
              </thead>
              <tbody>
                {registrations.map((r: Registration) => (
                  <tr key={r.id}>
                    <td>{r.full_name}</td>
                    <td>{r.email}</td>
                    <td>{r.congress_year}</td>
                    <td>{typeLabel(r.ticket_type)}</td>
                    <td>{r.amount_paid > 0 ? `$${r.amount_paid}` : 'Free'}</td>
                    <td>{r.country || '—'}</td>
                    <td>{new Date(r.registered_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {registrations.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>No registrations found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Speakers Tab */}
        {tab === 'speakers' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <button className="admin-btn admin-btn-primary" onClick={() => { setEditSpeaker(null); setShowSpeakerModal(true); }}>+ Add Speaker</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Role</th><th>Affiliation</th><th>Order</th><th>Actions</th></tr></thead>
                <tbody>
                  {speakers.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td><td>{s.role}</td><td>{s.affiliation}</td><td>{s.sort_order}</td>
                      <td>
                        <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8 }} onClick={() => { setEditSpeaker(s); setShowSpeakerModal(true); }}>Edit</button>
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
                {editSpeaker ? 'Edit Speaker' : 'Add Speaker'}
              </h2>
              <form onSubmit={e => { e.preventDefault(); saveSpeaker(new FormData(e.currentTarget)); }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input name="name" className="form-input" defaultValue={editSpeaker?.name} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input name="role" className="form-input" defaultValue={editSpeaker?.role || 'Keynote'} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input name="sort_order" type="number" className="form-input" defaultValue={editSpeaker?.sort_order ?? 0} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Affiliation</label>
                  <input name="affiliation" className="form-input" defaultValue={editSpeaker?.affiliation} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input name="image_url" className="form-input" defaultValue={editSpeaker?.image_url} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea name="bio" className="form-textarea" defaultValue={editSpeaker?.bio} />
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

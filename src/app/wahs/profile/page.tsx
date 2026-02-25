'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/lib/supabase';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bolivia','Bosnia and Herzegovina','Botswana',
  'Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Chile','China',
  'Colombia','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France','Gabon','Georgia','Germany',
  'Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Madagascar','Malaysia','Mali','Malta','Mexico',
  'Moldova','Mongolia','Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','North Korea','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia',
  'Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other',
];

type MemberProfile = {
  id: string;
  full_name: string;
  institution: string | null;
  country: string | null;
  membership_type: string;
  membership_status: string;
  email: string;
};

export default function WAHSProfilePage() {
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/wahs/login'); return; }

      const { data } = await supabase
        .from('wahs_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!data) { router.push('/wahs/login'); return; }
      setMember(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleProfileUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setProfileError('');
    setProfileSuccess('');

    const form = new FormData(e.currentTarget);
    const updates = {
      full_name: form.get('full_name') as string,
      institution: form.get('institution') as string || null,
      country: form.get('country') as string || null,
    };

    const { error } = await supabase
      .from('wahs_members')
      .update(updates)
      .eq('id', member!.id);

    if (error) {
      setProfileError(error.message);
    } else {
      setMember(prev => prev ? { ...prev, ...updates } : null);
      setProfileSuccess('Profile updated successfully.');
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');

    const form = new FormData(e.currentTarget);
    const newPassword = form.get('new_password') as string;
    const confirm = form.get('confirm_password') as string;

    if (newPassword !== confirm) {
      setPwError('Passwords do not match.');
      setPwLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.');
      setPwLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError(error.message);
    } else {
      setPwSuccess('Password changed successfully.');
      (e.target as HTMLFormElement).reset();
    }
    setPwLoading(false);
  }

  if (loading) {
    return (
      <div className="main-page">
        <MainNav />
        <main className="main-content">
          <section className="main-content-section">
            <div className="main-content-inner" style={{ textAlign: 'center', paddingTop: 60 }}>
              <p>Loading your profile…</p>
            </div>
          </section>
        </main>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="main-page">
      <MainNav />
      <main className="main-content">
        <section className="main-page-header">
          <div className="main-page-header-inner">
            <h1 className="main-page-title">My Profile</h1>
            <p className="main-page-subtitle">Manage your membership information</p>
          </div>
        </section>

        <section className="main-content-section">
          <div className="main-content-inner" style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
              <Link href="/wahs/dashboard" style={{ color: 'var(--kr-blue)', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
            </div>

            {/* Profile Form */}
            <div className="main-content-box" style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--navy)', marginBottom: 20 }}>
                Personal Information
              </h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={member?.email || ''} disabled
                    style={{ background: '#f5f5f5', color: 'var(--mist)', cursor: 'not-allowed' }} />
                  <p className="form-help">Email cannot be changed. Contact us if needed.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input type="text" name="full_name" className="form-input" defaultValue={member?.full_name || ''} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Institution / Affiliation</label>
                  <input type="text" name="institution" className="form-input" defaultValue={member?.institution || ''} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select name="country" className="form-select" defaultValue={member?.country || ''}>
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {profileError && <p className="form-error" style={{ marginBottom: 12 }}>{profileError}</p>}
                {profileSuccess && <p style={{ color: '#065f46', background: '#d1fae5', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: '0.9rem' }}>{profileSuccess}</p>}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                  style={{ opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Password Change */}
            <div className="main-content-box">
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: 'var(--navy)', marginBottom: 20 }}>
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">New Password <span className="required">*</span></label>
                  <input type="password" name="new_password" className="form-input" required minLength={8} autoComplete="new-password" />
                  <p className="form-help">Minimum 8 characters</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password <span className="required">*</span></label>
                  <input type="password" name="confirm_password" className="form-input" required minLength={8} autoComplete="new-password" />
                </div>
                {pwError && <p className="form-error" style={{ marginBottom: 12 }}>{pwError}</p>}
                {pwSuccess && <p style={{ color: '#065f46', background: '#d1fae5', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: '0.9rem' }}>{pwSuccess}</p>}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={pwLoading}
                  style={{ opacity: pwLoading ? 0.6 : 1 }}
                >
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

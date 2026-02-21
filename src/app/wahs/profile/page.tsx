'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';

export default function WahsProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    affiliation: '',
    country: '',
    bio: '',
    research_interests: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      // Check if user is authenticated as WAHS member
      const authData = localStorage.getItem('wahs_auth');
      if (!authData) {
        router.push('/wahs/login?redirect=/wahs/profile');
        return;
      }

      try {
        const auth = JSON.parse(authData);
        if (!auth.authenticated || auth.userType !== 'wahs') {
          router.push('/wahs/login?redirect=/wahs/profile');
          return;
        }

        // User is WAHS member - fetch profile
        setIsMember(true);
        
        const { data: profileData, error } = await supabase
          .from('wahs_members')
          .select('*')
          .eq('email', auth.email.toLowerCase())
          .single();

        if (error) throw error;
        
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          affiliation: profileData.affiliation || '',
          country: profileData.country || '',
          bio: profileData.bio || '',
          research_interests: profileData.research_interests || '',
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setMessage({ type: 'error', text: 'Error loading profile' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const authData = localStorage.getItem('wahs_auth');
      if (!authData) throw new Error('Not authenticated');

      const auth = JSON.parse(authData);
      
      const { error } = await supabase
        .from('wahs_members')
        .update({
          name: formData.name,
          affiliation: formData.affiliation,
          country: formData.country,
          bio: formData.bio,
          research_interests: formData.research_interests,
          updated_at: new Date().toISOString(),
        })
        .eq('email', auth.email.toLowerCase());

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update local profile
      setProfile({
        ...profile,
        ...formData,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return null; // Already redirecting
  }

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">WAHS Member Profile</h1>
            <p className="mt-2 text-gray-600">Update your member profile information</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
                      Affiliation/Institution
                    </label>
                    <input
                      type="text"
                      name="affiliation"
                      id="affiliation"
                      value={formData.affiliation}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a country</option>
                      <option value="South Korea">South Korea</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="research_interests" className="block text-sm font-medium text-gray-700">
                      Research Interests
                    </label>
                    <input
                      type="text"
                      name="research_interests"
                      id="research_interests"
                      value={formData.research_interests}
                      onChange={handleChange}
                      placeholder="e.g., K-pop, Korean drama, Korean language education"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio/Introduction
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about yourself, your research, and your interest in Hallyu studies..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/wahs/dashboard')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Membership Info Card */}
          {profile && (
            <div className="mt-8 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Membership Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {profile.membership_type?.replace('_', ' ') || 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Membership Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.membership_status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profile.membership_status || 'pending'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.approved_at ? new Date(profile.approved_at).toLocaleDateString() : 'Not approved yet'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Membership Expires</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.membership_expiry ? new Date(profile.membership_expiry).toLocaleDateString() : 'Not set'}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <a
                    href="/wahs/dashboard"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    ← Back to Dashboard
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <MainFooter />
    </>
  );
}
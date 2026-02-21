'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CongressProfilePage() {
  const { user, userType, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    affiliation: '',
    country: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userType !== 'congress')) {
      router.push('/congress/login');
    } else if (user && userType === 'congress') {
      loadProfile();
    }
  }, [user, userType, loading, router]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('congress_submitters')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        // Profile might not exist yet
        return;
      }

      if (data) {
        setProfileExists(true);
        setFormData({
          full_name: data.full_name || '',
          affiliation: data.affiliation || '',
          country: data.country || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validation
    if (!formData.full_name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your full name' });
      setSaving(false);
      return;
    }

    if (!formData.country.trim()) {
      setMessage({ type: 'error', text: 'Please enter your country' });
      setSaving(false);
      return;
    }

    try {
      if (profileExists) {
        // Update existing profile
        const { error } = await updateProfile({
          full_name: formData.full_name,
          affiliation: formData.affiliation,
          country: formData.country,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        // Create new profile (shouldn't happen if AuthContext is working)
        const { error } = await supabase
          .from('congress_submitters')
          .insert({
            id: user?.id,
            email: user?.email,
            full_name: formData.full_name,
            affiliation: formData.affiliation,
            country: formData.country,
            bio: formData.bio,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        setProfileExists(true);
        setMessage({ type: 'success', text: 'Profile created successfully!' });
      }
    } catch (error: any) {
      console.error('Profile save error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || userType !== 'congress') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Congress Profile</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Complete your profile for abstract submission
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/congress/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  readOnly
                  disabled
                  className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Affiliation */}
            <div>
              <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
                Affiliation
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="affiliation"
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="University, Institution, or Company"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Your country"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio / Research Interests
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Briefly describe your research interests and background..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional. This may be visible to reviewers.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900">Profile Information</h3>
          <ul className="mt-2 text-sm text-blue-800 space-y-1">
            <li>• Your profile information will be used for abstract submission</li>
            <li>• Name and affiliation will appear on accepted abstracts</li>
            <li>• Country information helps with conference planning</li>
            <li>• Bio is optional but helps reviewers understand your background</li>
          </ul>
          <div className="mt-4">
            <Link
              href="/congress/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
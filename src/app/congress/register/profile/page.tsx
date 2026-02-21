'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email-notifications';

export default function CongressProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    affiliation: '',
    country: '',
    presentationType: 'individual',
    abstractTitle: '',
    abstractText: '',
    keywords: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to complete your profile');
      }

      // Create congress submitter profile
      const { data: profile, error: profileError } = await supabase
        .from('congress_submitters')
        .insert({
          user_id: user.id,
          email: user.email,
          full_name: formData.fullName,
          affiliation: formData.affiliation,
          country: formData.country,
          bio: formData.bio
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create submission
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          submitter_id: profile.id,
          title: formData.abstractTitle,
          abstract: formData.abstractText,
          presentation_type: formData.presentationType,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          status: 'submitted'
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Send confirmation email
      await sendEmail(user.email!, 'SUBMISSION_CONFIRMATION', {
        name: formData.fullName,
        submissionId: submission.id
      });

      // Redirect to dashboard
      router.push('/congress/dashboard');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Congress Profile</h1>
          <p className="mt-2 text-gray-600">Finish setting up your account and submit your abstract for WAHS Congress 2026</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Personal Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. Jane Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliation
                </label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="University of Example"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="South Korea"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentation Type *
                </label>
                <select
                  name="presentationType"
                  value={formData.presentationType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual Paper</option>
                  <option value="panel">Full Panel</option>
                  <option value="roundtable">Roundtable</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief introduction about yourself and your research interests..."
              />
            </div>
          </div>

          {/* Abstract Submission */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Abstract Submission</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract Title *
              </label>
              <input
                type="text"
                name="abstractTitle"
                value={formData.abstractTitle}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title of your presentation"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract Text (300-500 words) *
              </label>
              <textarea
                name="abstractText"
                value={formData.abstractText}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your abstract here..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Word count: {formData.abstractText.split(/\s+/).filter(word => word.length > 0).length}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hallyu, K-pop, Korean drama, cultural studies"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Abstract & Complete Profile'}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <p>* Required fields</p>
            <p className="mt-1">By submitting, you agree to the WAHS Congress terms and conditions.</p>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>Need help? Contact <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
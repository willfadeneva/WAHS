'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Submission {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  file_url: string | null;
  withdrawn: boolean;
}

export default function CongressDashboardPage() {
  const { user, userType, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    affiliation: profile?.affiliation || ''
  });

  useEffect(() => {
    if (!loading && (!user || userType !== 'congress')) {
      router.push('/congress/login');
    }
  }, [user, userType, loading, router]);

  useEffect(() => {
    if (user && userType === 'congress') {
      loadSubmissions();
    }
  }, [user, userType]);

  const loadSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('submitter_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setSubmissions(data);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    
    await supabase
      .from('congress_submitters')
      .update(profileData)
      .eq('id', user?.id);
    
    setProfileLoading(false);
    alert('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || userType !== 'congress') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Abstract Submission Dashboard</h1>
              <p className="text-gray-600">Manage your research abstracts for Congress 2026</p>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This dashboard is for abstract submission only. 
                  To register for the Congress event (buy tickets), visit{' '}
                  <a href="/2026/registration" className="underline font-medium">/2026/registration</a>
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Affiliation</label>
                  <input
                    type="text"
                    value={profileData.affiliation}
                    onChange={(e) => setProfileData({...profileData, affiliation: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="University/Organization"
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/2026/submissions-new"
                  className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Submit New Abstract
                </Link>
                <button
                  onClick={loadSubmissions}
                  className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Refresh Submissions
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Submissions */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Submissions</h2>
                <p className="text-sm text-gray-600">Track the status of your abstracts</p>
              </div>
              
              {submissions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                  <p className="text-gray-600 mb-4">Submit your first abstract to get started</p>
                  <Link
                    href="/2026/submissions"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Abstract
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-md font-medium text-gray-900">{submission.title}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize">{submission.type.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>Submitted {new Date(submission.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            submission.withdrawn ? 'bg-gray-100 text-gray-800' :
                            submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.withdrawn ? 'Withdrawn' : submission.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => alert('Edit functionality coming soon')}
                          disabled={submission.withdrawn || submission.status !== 'submitted'}
                          className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to withdraw this submission?')) {
                              // Withdraw logic here
                              alert('Withdraw functionality coming soon');
                            }
                          }}
                          disabled={submission.withdrawn}
                          className="text-sm text-red-600 hover:text-red-500 disabled:text-gray-400"
                        >
                          Withdraw
                        </button>
                        {submission.file_url && (
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-500"
                          >
                            Download File
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Legend */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Submission Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
                  <span>Submitted - Under review</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
                  <span>Accepted - Congratulations!</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
                  <span>Rejected - Try next year</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded-full mr-2"></div>
                  <span>Withdrawn - No longer active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
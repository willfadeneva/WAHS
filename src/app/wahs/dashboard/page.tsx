'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WahsDashboardPage() {
  const { user, userType, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    affiliation: profile?.affiliation || '',
    bio: profile?.bio || '',
    photo_url: profile?.photo_url || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userType !== 'wahs')) {
      router.push('/wahs/login');
    }
  }, [user, userType, loading, router]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        affiliation: profile.affiliation || '',
        bio: profile.bio || '',
        photo_url: profile.photo_url || ''
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    
    await supabase
      .from('wahs_members')
      .update(profileData)
      .eq('id', user?.id);
    
    setProfileLoading(false);
    refreshProfile();
    alert('Profile updated successfully!');
  };

  const handleSendLoginLink = async () => {
    if (!user?.email) return;
    
    try {
      const response = await fetch('/api/auth/send-login-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Login link sent to your email! Check your inbox.');
      } else {
        alert(`Failed to send login link: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to send login link. Please try again.');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `member-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading photo: ' + uploadError.message);
      setUploadingPhoto(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('member-photos')
      .getPublicUrl(filePath);

    // Update profile with photo URL
    setProfileData({ ...profileData, photo_url: publicUrl });
    await supabase
      .from('wahs_members')
      .update({ photo_url: publicUrl })
      .eq('id', user.id);
    
    setUploadingPhoto(false);
    refreshProfile();
    alert('Photo uploaded successfully!');
  };

  const getStatusBadge = () => {
    if (!profile) return null;
    
    const status = profile.membership_status;
    const type = profile.membership_type;
    
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved Member' },
      active: { color: 'bg-blue-100 text-blue-800', text: 'Active Member' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Application Rejected' }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
            {badge.text}
          </span>
          <p className="mt-2 text-sm text-gray-600">
            {type === 'paid' ? 'Paid Membership' : 'Free Membership'} • 
            Applied on {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        {status === 'pending' && (
          <div className="text-sm text-gray-500">
            ⏳ Admin approval required
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || userType !== 'wahs') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WAHS Member Dashboard</h1>
              <p className="text-gray-600">Welcome to the World Association for Hallyu Studies</p>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {getStatusBadge()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief biography (will appear in member directory)"
                  />
                  <p className="mt-1 text-sm text-gray-500">Max 500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                  <div className="mt-2 flex items-center space-x-4">
                    {profileData.photo_url ? (
                      <img 
                        src={profileData.photo_url} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No photo</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">JPG or PNG, max 2MB</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Membership Info */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Membership Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Membership Type</span>
                  <span className="font-medium">{profile?.membership_type === 'paid' ? 'Paid' : 'Free'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">{profile?.membership_status}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
                {profile?.approved_at && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Approved On</span>
                    <span className="font-medium">{new Date(profile.approved_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Resources & Actions */}
          <div className="space-y-6">
            {/* Member Resources */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Member Resources</h2>
              <div className="space-y-3">
                <button
                  onClick={() => alert('Member directory coming soon!')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Member Directory</div>
                  <div className="text-sm text-gray-600">Browse other WAHS members</div>
                </button>
                <button
                  onClick={() => alert('Resources coming soon!')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Research Resources</div>
                  <div className="text-sm text-gray-600">Papers, recordings, materials</div>
                </button>
                <button
                  onClick={() => alert('Events coming soon!')}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Upcoming Events</div>
                  <div className="text-sm text-gray-600">Conferences, webinars, meetings</div>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleSendLoginLink}
                  className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Send Login Link to Email
                </button>
                <button
                  onClick={() => window.open('https://paypal.me/wahskorea', '_blank')}
                  className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Upgrade to Paid Membership
                </button>
                <button
                  onClick={() => router.push('/2026/submissions')}
                  className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Submit to Congress 2026
                </button>
                <button
                  onClick={() => alert('Contact form coming soon!')}
                  className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Contact WAHS Admin
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-md font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Contact WAHS administration for membership questions or technical issues.
              </p>
              <div className="text-sm">
                <div className="font-medium text-blue-900">Email</div>
                <div className="text-blue-700">wahskorea@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
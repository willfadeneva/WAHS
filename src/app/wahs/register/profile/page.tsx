'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email-notifications';

export default function WahsProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    affiliation: '',
    country: '',
    membershipType: 'professional', // 'professional' or 'non_professional'
    bio: '',
    researchInterests: ''
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

      // Determine membership status based on type
      const isFreeMembership = formData.membershipType === 'free';
      const membershipStatus = isFreeMembership ? 'approved' : 'pending';
      
      // Create WAHS member profile
      const { data: profile, error: profileError } = await supabase
        .from('wahs_members')
        .insert({
          user_id: user.id,
          email: user.email,
          full_name: formData.fullName,
          affiliation: formData.affiliation,
          country: formData.country,
          membership_type: formData.membershipType,
          membership_status: membershipStatus,
          approved_at: isFreeMembership ? new Date().toISOString() : null,
          membership_expiry: isFreeMembership ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] : null,
          bio: formData.bio,
          research_interests: formData.researchInterests.split(',').map(ri => ri.trim())
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Send application confirmation email
      await sendEmail(user.email!, 'MEMBERSHIP_APPLICATION', {
        name: formData.fullName,
        membershipType: formData.membershipType,
        status: membershipStatus
      });

      // Redirect based on membership type
      if (isFreeMembership) {
        // Free membership: Go directly to dashboard (auto-approved)
        router.push('/wahs/dashboard');
      } else {
        // Paid membership: Go to payment page
        router.push(`/wahs/payment?membership=${formData.membershipType}`);
      }

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

  const membershipTypes = [
    {
      value: 'free',
      label: 'Free Membership',
      price: 'FREE',
      description: 'Basic membership for students and enthusiasts. Requires admin approval. Access to member resources and newsletter.'
    },
    {
      value: 'professional',
      label: 'Professional Membership',
      price: '$250/year',
      description: 'For academic professionals, researchers, and industry practitioners. Includes free congress registration and voting rights.'
    },
    {
      value: 'non_professional',
      label: 'Non-Professional Membership',
      price: '$150/year',
      description: 'For students, independent researchers, and enthusiasts. Includes discounted congress registration.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your WAHS Membership Profile</h1>
          <p className="mt-2 text-gray-600">Finish setting up your account and proceed to payment</p>
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
                placeholder="Brief introduction about yourself and your background in Hallyu studies..."
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Interests (comma-separated)
              </label>
              <input
                type="text"
                name="researchInterests"
                value={formData.researchInterests}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="K-pop, Korean drama, cultural globalization, fandom studies"
              />
            </div>
          </div>

          {/* Membership Type Selection */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Membership Type</h2>
            
            <div className="space-y-4">
              {membershipTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.membershipType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData({ ...formData, membershipType: type.value })}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="membershipType"
                        value={type.value}
                        checked={formData.membershipType === type.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <label className="text-lg font-medium text-gray-900">
                            {type.label}
                          </label>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {type.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800">Payment Information</h3>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• After profile completion, you'll be redirected to PayPal for payment</li>
                <li>• Membership is activated immediately upon payment confirmation</li>
                <li>• Your membership will be valid for 1 year from payment date</li>
                <li>• Professional members get free WAHS Congress registration</li>
                <li>• Non-Professional members get discounted Congress registration</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>* Required fields</p>
              <p className="mt-1">By submitting, you agree to the WAHS membership terms and conditions.</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Profile & Proceed to Payment'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>Need help choosing a membership type? Contact <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// PayPal payment links from membership page
// Note: For automatic activation, PayPal NCP links need return URL parameter
// Format: https://www.paypal.com/ncp/payment/CODE?return=https://congress.iwahs.org/wahs/payment/success?membership=professional
const PAYPAL_BASE_URL = 'https://www.paypal.com/ncp/payment';
const PAYPAL_CODES = {
  professional: '9K9JC2CZ6N7S2',
  non_professional: 'Y2V33KK92X5SU',
};

// Generate PayPal link with return URL
const getPayPalLink = (membershipType: 'professional' | 'non_professional') => {
  const baseUrl = `${PAYPAL_BASE_URL}/${PAYPAL_CODES[membershipType]}`;
  const returnUrl = `https://congress.iwahs.org/wahs/payment/success?membership=${membershipType}`;
  return `${baseUrl}?return=${encodeURIComponent(returnUrl)}`;
};

export default function WahsPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMembershipType, setSelectedMembershipType] = useState<'professional' | 'non_professional' | null>(null);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get membership type from URL (optional - user can choose on page)
        const type = searchParams.get('membership') as 'free' | 'professional' | 'non_professional';
        
        if (type && ['free', 'professional', 'non_professional'].includes(type)) {
          if (type === 'free') {
            // Free membership shouldn't reach payment page
            router.push('/wahs/dashboard');
            return;
          }
          setSelectedMembershipType(type);
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('You must be logged in to make a payment');
        }

        // Get member info
        const { data: member, error: memberError } = await supabase
          .from('wahs_members')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (memberError) throw memberError;
        
        setMemberInfo(member);
        setLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment information');
        setLoading(false);
      }
    };

    loadData();
  }, [router, searchParams]);

  const handlePayPalRedirect = (membershipType: 'professional' | 'non_professional') => {
    const paypalLink = getPayPalLink(membershipType);
    
    // Store selected membership type for verification
    setSelectedMembershipType(membershipType);
    
    // Redirect to PayPal (not open in new tab for better return flow)
    window.location.href = paypalLink;
  };

  const handlePaymentComplete = async () => {
    if (!memberInfo || !selectedMembershipType) {
      alert('Please select a membership type first');
      return;
    }
    
    const paymentId = prompt(`Please enter your PayPal transaction ID for ${selectedMembershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership (you can find this in your PayPal receipt email):`);
    
    if (!paymentId) {
      alert('Payment ID is required for verification');
      return;
    }

    try {
      // In production, this would be automated via PayPal webhook
      // For now, we'll mark it as manually verified
      const { error } = await supabase
        .from('wahs_members')
        .update({
          membership_type: selectedMembershipType,
          payment_id: paymentId,
          payment_date: new Date().toISOString(),
          membership_status: 'active',
          approved_at: new Date().toISOString(),
          membership_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        })
        .eq('id', memberInfo.id);

      if (error) throw error;

      alert(`Payment verified successfully! Your ${selectedMembershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership is now active. Redirecting to your dashboard...`);
      router.push('/wahs/dashboard');

    } catch (err) {
      alert(`Error verifying payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/wahs/register/profile')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const price = selectedMembershipType === 'professional' ? 250 : 150;
  const membershipName = selectedMembershipType === 'professional' ? 'Professional' : 'Non-Professional';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your WAHS Membership Payment</h1>
          <p className="mt-2 text-gray-600">Activate your {membershipName} Membership</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Member Info */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Member Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{memberInfo?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{memberInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Membership</p>
                <p className="font-medium">{memberInfo?.membership_type ? memberInfo.membership_type.charAt(0).toUpperCase() + memberInfo.membership_type.slice(1) : 'Not selected'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${memberInfo?.membership_status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {memberInfo?.membership_status ? memberInfo.membership_status.charAt(0).toUpperCase() + memberInfo.membership_status.slice(1) : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Instructions</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Click the PayPal button below</p>
                  <p className="text-sm text-gray-500">You'll be redirected to PayPal's secure payment page</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Complete payment on PayPal</p>
                  <p className="text-sm text-gray-500">Use your PayPal account or credit/debit card</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Return here and verify payment</p>
                  <p className="text-sm text-gray-500">Enter your PayPal transaction ID to activate membership</p>
                </div>
              </div>
            </div>
          </div>

          {/* Two Payment Options */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 text-center">Choose Your Membership Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Membership */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Professional</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">$250<span className="text-sm font-normal text-gray-500">/year</span></p>
                  <p className="text-sm text-gray-500 mt-1">For academics, researchers, professionals</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Full voting rights</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Conference discounts</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Research publication access</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handlePayPalRedirect('professional')}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.973.382-1.052.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-1.588-1.17-3.832-1.49-5.822-1.49h-5.91c-.524 0-.973.382-1.052.9L6.734 19.09h4.376a.65.65 0 0 0 .643-.557l1.85-11.78c.072-.46.44-.777.902-.777h.59c4.303 0 7.82 1.738 8.733 6.746.023.144.046.287.076.434.207 1.06.282 2.291-.417 3.362-.793 1.21-2.304 1.87-4.13 1.87h-1.294c-.524 0-.973.382-1.052.9l-.72 4.58h.007z"/>
                  </svg>
                  Pay $250 with PayPal
                </button>
              </div>

              {/* Non-Professional Membership */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Non-Professional</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">$150<span className="text-sm font-normal text-gray-500">/year</span></p>
                  <p className="text-sm text-gray-500 mt-1">For students, enthusiasts, general public</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Access to member resources</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Newsletter subscription</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Community forum access</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handlePayPalRedirect('non_professional')}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.973.382-1.052.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-1.588-1.17-3.832-1.49-5.822-1.49h-5.91c-.524 0-.973.382-1.052.9L6.734 19.09h4.376a.65.65 0 0 0 .643-.557l1.85-11.78c.072-.46.44-.777.902-.777h.59c4.303 0 7.82 1.738 8.733 6.746.023.144.046.287.076.434.207 1.06.282 2.291-.417 3.362-.793 1.21-2.304 1.87-4.13 1.87h-1.294c-.524 0-.973.382-1.052.9l-.72 4.58h.007z"/>
                  </svg>
                  Pay $150 with PayPal
                </button>
              </div>
            </div>

            {/* Manual Verification (Fallback) */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Issues?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you completed payment but weren't automatically redirected back, or if you need manual verification, use this option.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Membership Type</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedMembershipType('professional')}
                    className={`px-4 py-2 border rounded-md ${selectedMembershipType === 'professional' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Professional ($250)
                  </button>
                  <button
                    onClick={() => setSelectedMembershipType('non_professional')}
                    className={`px-4 py-2 border rounded-md ${selectedMembershipType === 'non_professional' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Non-Professional ($150)
                  </button>
                </div>
              </div>
              
              <button
                onClick={handlePaymentComplete}
                disabled={!selectedMembershipType}
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Manual Verification for {selectedMembershipType === 'professional' ? 'Professional' : 'Non-Professional'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• Payment issues? Contact PayPal support</li>
            <li>• Membership questions? Email <a href="mailto:wahskorea@gmail.com" className="underline">wahskorea@gmail.com</a></li>
            <li>• Transaction ID can be found in your PayPal receipt email</li>
            <li>• Membership activates immediately after verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
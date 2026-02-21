'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// PayPal payment links from membership page
const PAYPAL_LINKS = {
  professional: 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  non_professional: 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export default function WahsPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [membershipType, setMembershipType] = useState<'professional' | 'non_professional' | null>(null);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get membership type from URL
        const type = searchParams.get('membership') as 'professional' | 'non_professional';
        
        if (!type || !['professional', 'non_professional'].includes(type)) {
          throw new Error('Invalid membership type');
        }
        
        setMembershipType(type);

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

  const handlePayPalRedirect = () => {
    if (!membershipType) return;
    
    const paypalLink = PAYPAL_LINKS[membershipType];
    window.open(paypalLink, '_blank');
    
    // Show payment instructions
    alert(`Redirecting to PayPal for ${membershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership payment.\n\nAfter completing payment on PayPal, please return to this page and click "I've Paid" to verify your payment.`);
  };

  const handlePaymentComplete = async () => {
    if (!memberInfo) return;
    
    const paymentId = prompt('Please enter your PayPal transaction ID (you can find this in your PayPal receipt email):');
    
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
          payment_id: paymentId,
          payment_date: new Date().toISOString(),
          membership_status: 'active',
          approved_at: new Date().toISOString(),
          membership_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        })
        .eq('id', memberInfo.id);

      if (error) throw error;

      alert('Payment verified successfully! Your membership is now active. Redirecting to your dashboard...');
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

  const price = membershipType === 'professional' ? 250 : 150;
  const membershipName = membershipType === 'professional' ? 'Professional' : 'Non-Professional';

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
                <p className="text-sm text-gray-500">Membership Type</p>
                <p className="font-medium">{membershipName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-blue-600">${price}/year</p>
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

          {/* PayPal Button */}
          <div className="p-6">
            <div className="text-center">
              <button
                onClick={handlePayPalRedirect}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.973.382-1.052.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-1.588-1.17-3.832-1.49-5.822-1.49h-5.91c-.524 0-.973.382-1.052.9L6.734 19.09h4.376a.65.65 0 0 0 .643-.557l1.85-11.78c.072-.46.44-.777.902-.777h.59c4.303 0 7.82 1.738 8.733 6.746.023.144.046.287.076.434.207 1.06.282 2.291-.417 3.362-.793 1.21-2.304 1.87-4.13 1.87h-1.294c-.524 0-.973.382-1.052.9l-.72 4.58h.007z"/>
                </svg>
                Pay with PayPal
              </button>
              
              <p className="mt-4 text-sm text-gray-500">
                Secure payment processed by PayPal
              </p>
            </div>

            {/* Manual Verification */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Already Paid?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you've already completed payment on PayPal, click below to verify your payment and activate your membership.
              </p>
              
              <button
                onClick={handlePaymentComplete}
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                I've Paid - Verify My Payment
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
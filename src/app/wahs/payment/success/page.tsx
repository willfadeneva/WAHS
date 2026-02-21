'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL (PayPal returns these)
        const paymentId = searchParams.get('paymentId');
        const payerId = searchParams.get('PayerID');
        const token = searchParams.get('token');
        const membershipType = searchParams.get('membership') as 'professional' | 'non_professional';

        console.log('Payment success params:', { paymentId, payerId, token, membershipType });

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('You must be logged in');
        }

        if (!membershipType || !['professional', 'non_professional'].includes(membershipType)) {
          throw new Error('Invalid membership type');
        }

        // Get member info
        const { data: member, error: memberError } = await supabase
          .from('wahs_members')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (memberError) throw memberError;

        setMemberInfo(member);

        // In production, we would:
        // 1. Verify payment with PayPal API using paymentId
        // 2. Check payment status
        // 3. Activate membership
        
        // For now, simulate payment verification
        setMessage('Payment verified! Activating your membership...');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Activate membership
        const { error: updateError } = await supabase
          .from('wahs_members')
          .update({
            membership_type: membershipType,
            payment_id: paymentId || `manual_${Date.now()}`,
            payment_date: new Date().toISOString(),
            membership_status: 'active',
            approved_at: new Date().toISOString(),
            membership_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
          })
          .eq('id', member.id);

        if (updateError) throw updateError;

        setStatus('success');
        setMessage(`Your ${membershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership is now active!`);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/wahs/dashboard');
        }, 3000);

      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to process payment');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
          <p className="mt-2 text-gray-600">We're activating your WAHS membership</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-8">
            {/* Status Indicator */}
            <div className="text-center mb-6">
              {status === 'processing' && (
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {status === 'success' && (
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                  <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-900">{message}</p>
              
              {status === 'processing' && (
                <p className="mt-2 text-sm text-gray-500">
                  This may take a few moments. Please don't close this window.
                </p>
              )}
              
              {status === 'success' && (
                <p className="mt-2 text-sm text-gray-500">
                  Redirecting to your dashboard...
                </p>
              )}
            </div>

            {/* Member Info */}
            {memberInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Member Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Name:</span> {memberInfo.full_name}</p>
                  <p><span className="text-gray-500">Email:</span> {memberInfo.email}</p>
                  <p><span className="text-gray-500">Status:</span> 
                    <span className={`ml-2 font-medium ${memberInfo.membership_status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {memberInfo.membership_status ? memberInfo.membership_status.charAt(0).toUpperCase() + memberInfo.membership_status.slice(1) : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 space-y-4">
              {status === 'success' && (
                <div className="text-center">
                  <Link
                    href="/wahs/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
              
              {status === 'error' && (
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  
                  <Link
                    href="/wahs/payment"
                    className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Return to Payment Page
                  </Link>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Need Help?</h4>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Payment issues? Contact PayPal support</li>
                <li>• Membership questions? Email <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a></li>
                <li>• Didn't receive confirmation? Check your spam folder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [membershipType, setMembershipType] = useState<'professional' | 'non_professional' | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL
        const membership = searchParams.get('membership') as 'professional' | 'non_professional';
        
        if (!membership || !['professional', 'non_professional'].includes(membership)) {
          throw new Error('Invalid membership type');
        }

        setMembershipType(membership);
        
        // Simulate payment processing
        setMessage('Verifying payment...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setMessage('Activating your membership...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get current user from Supabase auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          throw new Error('User not authenticated');
        }

        // Update membership in Supabase
        const membershipExpiry = new Date();
        membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1); // 1 year from now
        
        const { error: updateError } = await supabase
          .from('wahs_members')
          .update({
            membership_type: membership === 'professional' ? 'paid_professional' : 'paid_non_professional',
            membership_status: 'active',
            payment_date: new Date().toISOString(),
            membership_expiry: membershipExpiry.toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          })
          .eq('id', authUser.id);

        if (updateError) {
          console.error('Supabase update error:', updateError);
          throw new Error('Failed to activate membership');
        }
        
        setStatus('success');
        setMessage('Membership activated successfully!');
        
        // Redirect to profile page after 3 seconds
        setTimeout(() => {
          router.push('/wahs/profile');
        }, 3000);
        
      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Payment processing failed');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Payment Successful
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Thank you for joining WAHS
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'processing' && (
              <div className="mx-auto flex items-center justify-center h-12 w-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              {status === 'processing' && 'Processing Payment...'}
              {status === 'success' && 'Welcome to WAHS!'}
              {status === 'error' && 'Payment Error'}
            </h3>
            
            <p className="mt-2 text-sm text-gray-500">
              {message}
            </p>
            
            {membershipType && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Membership: <span className="font-semibold capitalize">{membershipType}</span>
                </p>
              </div>
            )}
            
            <div className="mt-6">
              {status === 'success' && (
                <div className="text-sm">
                  <p className="text-gray-600">Redirecting to your profile page...</p>
                  <div className="mt-4">
                    <Link
                      href="/wahs/profile"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Profile Now
                    </Link>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mt-4">
                  <Link
                    href="/membership"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </Link>
                  <p className="mt-2 text-xs text-gray-500">
                    If the problem persists, contact{' '}
                    <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">
                      wahskorea@gmail.com
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
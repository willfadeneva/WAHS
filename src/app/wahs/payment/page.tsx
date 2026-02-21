'use client';

import { useState } from 'react';
import Link from 'next/link';

// PayPal payment links
const PAYPAL_LINKS = {
  professional: 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  non_professional: 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export default function SimpleWahsPaymentPage() {
  const [selectedMembershipType, setSelectedMembershipType] = useState<'professional' | 'non_professional' | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleMembershipSelect = (type: 'professional' | 'non_professional') => {
    setSelectedMembershipType(type);
    setShowEmailInput(true);
  };

  const handlePayment = async () => {
    if (!selectedMembershipType) {
      setMessage({ type: 'error', text: 'Please select a membership type' });
      return;
    }

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // In production, you would:
      // 1. Send magic link to email
      // 2. Create user account
      // 3. Redirect to PayPal with return URL
      
      // For now, just redirect to PayPal
      const paypalLink = PAYPAL_LINKS[selectedMembershipType];
      const returnUrl = `https://congress.iwahs.org/wahs/payment/success?membership=${selectedMembershipType}&email=${encodeURIComponent(email)}`;
      const finalPayPalLink = `${paypalLink}?return=${encodeURIComponent(returnUrl)}`;
      
      window.location.href = finalPayPalLink;
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to process payment' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">WAHS Membership Payment</h1>
          <p className="mt-2 text-gray-600">Join the World Association for Hallyu Studies</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Professional Membership */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  PROFESSIONAL
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">$250 / year</h3>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full voting rights</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Congress registration</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Member directory access</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Research collaboration network</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority abstract review</span>
                </li>
              </ul>

              <button
                onClick={() => handleMembershipSelect('professional')}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  selectedMembershipType === 'professional'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {selectedMembershipType === 'professional' ? 'Selected' : 'Select Professional'}
              </button>
            </div>
          </div>

          {/* Non-Professional Membership */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-green-500">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  NON-PROFESSIONAL
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">$150 / year</h3>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Associate membership</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Discounted Congress registration</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Member directory access</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Newsletter subscription</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Online community access</span>
                </li>
              </ul>

              <button
                onClick={() => handleMembershipSelect('non_professional')}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  selectedMembershipType === 'non_professional'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {selectedMembershipType === 'non_professional' ? 'Selected' : 'Select Non-Professional'}
              </button>
            </div>
          </div>
        </div>

        {showEmailInput && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Enter Your Email</h3>
            <p className="text-gray-600 mb-4">
              Please enter your email address. After payment, you'll receive a magic link to access your member dashboard.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@university.edu"
                  required
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the WAHS membership terms and conditions. I understand that membership is valid for one year from the date of payment.
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !email || !email.includes('@')}
                className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay $${selectedMembershipType === 'professional' ? '250' : '150'} via PayPal`}
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Membership is valid for one year from the date of payment</li>
            <li>• You will receive a confirmation email with your membership details</li>
            <li>• After payment, you can login to your dashboard at <Link href="/wahs/login" className="text-blue-600 hover:text-blue-500">/wahs/login</Link></li>
            <li>• For questions, contact <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a></li>
            <li>• All payments are processed securely through PayPal</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link href="/membership" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Membership Information
          </Link>
        </div>
      </div>
    </div>
  );
}
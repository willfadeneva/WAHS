'use client';

import Link from 'next/link';

// Simple PayPal links - users pay directly, then contact us for account setup
const PAYPAL_LINKS = {
  professional: 'https://www.paypal.com/ncp/payment/9K9JC2CZ6N7S2',
  non_professional: 'https://www.paypal.com/ncp/payment/Y2V33KK92X5SU',
};

export default function SimpleDirectPaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">WAHS Membership Payment</h1>
          <p className="mt-2 text-gray-600">Simple PayPal payment - no account needed</p>
        </div>

        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Important Notice</h3>
          <p className="text-yellow-700">
            After payment, please email <a href="mailto:wahskorea@gmail.com" className="font-semibold underline">wahskorea@gmail.com</a> with:
          </p>
          <ul className="mt-2 text-yellow-700 list-disc list-inside space-y-1">
            <li>Your PayPal receipt/transaction ID</li>
            <li>Your email address</li>
            <li>Your full name</li>
            <li>Membership type (Professional or Non-Professional)</li>
          </ul>
          <p className="mt-3 text-yellow-700">
            We will manually activate your membership and send you login instructions.
          </p>
        </div>

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

              <a
                href={PAYPAL_LINKS.professional}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md text-center hover:bg-blue-700"
              >
                Pay $250 via PayPal
              </a>
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

              <a
                href={PAYPAL_LINKS.non_professional}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md text-center hover:bg-green-700"
              >
                Pay $150 via PayPal
              </a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">How It Works</h3>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">1</span>
              <span>Click the PayPal button for your chosen membership</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">2</span>
              <span>Complete payment on PayPal (credit card or PayPal account)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">3</span>
              <span>Email your receipt to <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a> with your details</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-3">4</span>
              <span>We'll activate your membership and send login instructions within 24 hours</span>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Already a Member?</h3>
          <div className="space-y-3">
            <p className="text-gray-600">
              If you've already paid and need login instructions, or if you're having issues:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Email <a href="mailto:wahskorea@gmail.com" className="text-blue-600 hover:text-blue-500">wahskorea@gmail.com</a> for support</li>
              <li>• Include your PayPal transaction ID</li>
              <li>• Login page: <Link href="/wahs/login" className="text-blue-600 hover:text-blue-500">/wahs/login</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link href="/membership" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Membership Information
          </Link>
        </div>
      </div>
    </div>
  );
}
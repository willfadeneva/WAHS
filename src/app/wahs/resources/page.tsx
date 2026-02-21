'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function WahsResourcesPage() {
  const { user, userType, signOut } = useAuth();

  if (!user || userType !== 'wahs') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">Access Denied</div>
          <p className="mt-2 text-gray-600">You need to be a WAHS member to access resources.</p>
          <Link href="/wahs/login" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WAHS Member Resources</h1>
              <p className="mt-1 text-sm text-gray-600">
                Exclusive resources for WAHS members
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/wahs/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome to Member Resources</h2>
              <p className="mt-1 text-sm text-gray-600">
                As a WAHS member, you have access to exclusive resources, research materials, 
                and networking opportunities in the field of Hallyu Studies.
              </p>
            </div>
          </div>
        </div>

        {/* Resource Categories */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resource Categories</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Research Database */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Research Database
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Academic Papers
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Conference Materials */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Conference Materials
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Past Congress Archives
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/2026/past-congresses" className="font-medium text-blue-700 hover:text-blue-900">
                    View archives
                  </Link>
                </div>
              </div>
            </div>

            {/* Networking */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Networking
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Connect with Members
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/wahs/members" className="font-medium text-blue-700 hover:text-blue-900">
                    Member Directory
                  </Link>
                </div>
              </div>
            </div>

            {/* Publications */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Publications
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Journals & Newsletters
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Teaching Resources */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Teaching Resources
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Course Materials
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Funding Opportunities */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Funding Opportunities
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Grants & Scholarships
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Member Directory Launched</div>
                  <div className="text-sm text-gray-500">February 2026</div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  New member directory now available. Connect with fellow Hallyu scholars worldwide.
                </p>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Congress 2026 Abstract Submission</div>
                  <div className="text-sm text-gray-500">January 2026</div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Submit your abstracts for the 12th World Congress for Hallyu Studies in Jeju.
                </p>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">New Membership Portal</div>
                  <div className="text-sm text-gray-500">December 2025</div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Updated membership system with improved profile management and resources.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900">Need Help?</h3>
            <p className="mt-2 text-sm text-blue-800">
              If you have questions about member resources or need assistance, please contact:
            </p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• <strong>Technical Support:</strong> wahskorea@gmail.com</li>
              <li>• <strong>Membership Questions:</strong> admin@wahs.org</li>
              <li>• <strong>Research Inquiries:</strong> research@wahs.org</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/wahs/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
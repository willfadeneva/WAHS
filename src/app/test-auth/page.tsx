'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];
    
    // Test 1: Check if pages exist
    try {
      const response = await fetch('/congress/submit-abstract');
      if (response.ok) {
        results.push('✅ Congress Register page loads');
      } else {
        results.push('❌ Congress Register page failed');
      }
    } catch (error) {
      results.push('❌ Congress Register page error: ' + error);
    }

    // Test 2: Check WAHS register
    try {
      const response = await fetch('/wahs/register');
      if (response.ok) {
        results.push('✅ WAHS Register page loads');
      } else {
        results.push('❌ WAHS Register page failed');
      }
    } catch (error) {
      results.push('❌ WAHS Register page error: ' + error);
    }

    // Test 3: Check admin page
    try {
      const response = await fetch('/admin');
      if (response.ok) {
        results.push('✅ Admin page loads');
      } else {
        results.push('❌ Admin page failed');
      }
    } catch (error) {
      results.push('❌ Admin page error: ' + error);
    }

    // Test 4: Check main site
    try {
      const response = await fetch('/');
      if (response.ok) {
        results.push('✅ Main site loads');
      } else {
        results.push('❌ Main site failed');
      }
    } catch (error) {
      results.push('❌ Main site error: ' + error);
    }

    // Test 5: Check congress submissions
    try {
      const response = await fetch('/2026/submissions');
      if (response.ok) {
        results.push('✅ Congress submissions page loads');
      } else {
        results.push('❌ Congress submissions page failed');
      }
    } catch (error) {
      results.push('❌ Congress submissions page error: ' + error);
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">WAHS Authentication System Test</h1>
        
        <div className="mb-8 p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Development server: Running on http://localhost:3000</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Supabase config: Environment variables loaded</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Database setup: Pending (run SQL from AUTH_SETUP.md)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Supabase Auth: Needs configuration</span>
            </div>
          </div>
        </div>

        <div className="mb-8 p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Test Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/congress/submit-abstract" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">Congress Register</div>
              <div className="text-sm text-gray-600">Register to submit abstracts</div>
            </Link>
            <Link href="/congress/login" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">Congress Login</div>
              <div className="text-sm text-gray-600">Login for submitters</div>
            </Link>
            <Link href="/wahs/register" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">WAHS Register</div>
              <div className="text-sm text-gray-600">Apply for membership</div>
            </Link>
            <Link href="/wahs/login" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">WAHS Login</div>
              <div className="text-sm text-gray-600">Member login</div>
            </Link>
            <Link href="/admin" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">Admin Dashboard</div>
              <div className="text-sm text-gray-600">Manage members & submissions</div>
            </Link>
            <Link href="/2026/submissions" className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="font-medium text-gray-900">Current Submissions</div>
              <div className="text-sm text-gray-600">Existing submission form</div>
            </Link>
          </div>

          <button
            onClick={runTests}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Run Automated Tests
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center">
                  {result.includes('✅') ? (
                    <div className="text-green-500 mr-2">✓</div>
                  ) : (
                    <div className="text-red-500 mr-2">✗</div>
                  )}
                  <span>{result}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Next Steps</h3>
          <ol className="list-decimal pl-5 space-y-2 text-blue-800">
            <li>Run the SQL migration from <code className="bg-blue-100 px-1 rounded">AUTH_SETUP.md</code> in Supabase</li>
            <li>Configure Supabase Auth with magic links</li>
            <li>Create storage buckets in Supabase Storage</li>
            <li>Create an admin user in the database</li>
            <li>Test the authentication flows</li>
            <li>Add navigation links to the new pages</li>
          </ol>
          <div className="mt-4">
            <Link 
              href="/" 
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
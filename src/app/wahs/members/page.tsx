'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface WahsMember {
  id: string;
  full_name: string;
  email: string;
  affiliation: string | null;
  bio: string | null;
  membership_type: string;
  membership_status: string;
  membership_expiry: string | null;
  created_at: string;
}

export default function WahsMembersPage() {
  const { user, userType, signOut } = useAuth();
  const [members, setMembers] = useState<WahsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'professional' | 'non_professional'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && userType === 'wahs') {
      loadMembers();
    } else if (user && userType !== 'wahs') {
      // Redirect if not a WAHS member
      window.location.href = '/';
    }
  }, [user, userType]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError('');

      let query = supabase
        .from('wahs_members')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter === 'active') {
        query = query.eq('membership_status', 'active');
      } else if (filter === 'professional') {
        query = query.eq('membership_type', 'paid_professional');
      } else if (filter === 'non_professional') {
        query = query.eq('membership_type', 'paid_non_professional');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error loading members:', fetchError);
        setError('Failed to load member directory');
      } else {
        setMembers(data || []);
      }
    } catch (error) {
      console.error('Member load error:', error);
      setError('Failed to load member directory');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.affiliation?.toLowerCase().includes(searchLower) ||
      member.bio?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMembershipBadge = (member: WahsMember) => {
    const type = member.membership_type;
    const status = member.membership_status;
    
    let color = 'bg-gray-100 text-gray-800';
    let text = type || 'Unknown';
    
    if (status === 'active') {
      if (type === 'paid_professional') {
        color = 'bg-blue-100 text-blue-800';
        text = 'Professional';
      } else if (type === 'paid_non_professional') {
        color = 'bg-green-100 text-green-800';
        text = 'Non-Professional';
      } else if (type === 'free') {
        color = 'bg-purple-100 text-purple-800';
        text = 'Free';
      }
    } else if (status === 'pending') {
      color = 'bg-yellow-100 text-yellow-800';
      text = 'Pending';
    } else if (status === 'expired') {
      color = 'bg-red-100 text-red-800';
      text = 'Expired';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  if (!user || userType !== 'wahs') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">Access Denied</div>
          <p className="mt-2 text-gray-600">You need to be a WAHS member to access the directory.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">WAHS Member Directory</h1>
              <p className="mt-1 text-sm text-gray-600">
                Connect with fellow Hallyu scholars and researchers
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
        {/* Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Directory Overview</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{members.length}</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {members.filter(m => m.membership_status === 'active').length}
                    </dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Professional Members</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {members.filter(m => m.membership_type === 'paid_professional').length}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search members</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by name, email, affiliation..."
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Members</option>
                  <option value="active">Active Only</option>
                  <option value="professional">Professional</option>
                  <option value="non_professional">Non-Professional</option>
                </select>
                <button
                  onClick={loadMembers}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 px-4 sm:px-0">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading directory</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading member directory...</p>
          </div>
        ) : (
          /* Members Grid */
          <div className="mt-8">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search ? 'Try a different search term' : 'No members match the current filter'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {member.full_name?.charAt(0) || 'M'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{member.full_name || 'Unnamed Member'}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">Membership</div>
                          {getMembershipBadge(member)}
                        </div>
                        {member.affiliation && (
                          <div className="mt-2">
                            <div className="text-sm text-gray-500">Affiliation</div>
                            <div className="text-sm font-medium text-gray-900">{member.affiliation}</div>
                          </div>
                        )}
                        {member.bio && (
                          <div className="mt-2">
                            <div className="text-sm text-gray-500">Bio</div>
                            <div className="text-sm text-gray-900 line-clamp-2">{member.bio}</div>
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                          <span>Member since {formatDate(member.created_at)}</span>
                          {member.membership_expiry && (
                            <span>Expires {formatDate(member.membership_expiry)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      <div className="text-sm">
                        <button
                          onClick={() => {
                            // In a real app, this would open a contact modal or email composer
                            window.location.href = `mailto:${member.email}?subject=WAHS%20Member%20Connection`;
                          }}
                          className="font-medium text-blue-700 hover:text-blue-900"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Directory Guidelines */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900">Directory Guidelines</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• This directory is for WAHS members only</li>
              <li>• Respect member privacy and contact information</li>
              <li>• Use professional communication when contacting members</li>
              <li>• Report any inappropriate use to admin@wahs.org</li>
              <li>• Members can update their visibility in profile settings</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
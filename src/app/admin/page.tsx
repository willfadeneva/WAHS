'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const { user, userType, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'wahs' | 'congress'>('wahs');
  const [wahsMembers, setWahsMembers] = useState<any[]>([]);
  const [congressSubmissions, setCongressSubmissions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && userType !== 'admin') {
      router.push('/');
    }
  }, [user, userType, loading, router]);

  useEffect(() => {
    if (userType === 'admin') {
      loadData();
    }
  }, [activeTab, userType]);

  const loadData = async () => {
    setLoadingData(true);
    
    if (activeTab === 'wahs') {
      const { data } = await supabase
        .from('wahs_members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setWahsMembers(data);
    } else {
      const { data } = await supabase
        .from('submissions')
        .select('*, congress_submitters(full_name, affiliation)')
        .order('created_at', { ascending: false });
      
      if (data) setCongressSubmissions(data);
    }
    
    setLoadingData(false);
  };

  const approveWahsMember = async (memberId: string) => {
    await supabase
      .from('wahs_members')
      .update({ 
        membership_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', memberId);
    
    loadData();
  };

  const updateSubmissionStatus = async (submissionId: string, status: string) => {
    await supabase
      .from('submissions')
      .update({ status })
      .eq('id', submissionId);
    
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (userType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WAHS Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, Admin</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('wahs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wahs'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              WAHS Members
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded">
                {wahsMembers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('congress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'congress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Congress Submissions
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded">
                {congressSubmissions.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Content */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading data...</div>
          </div>
        ) : activeTab === 'wahs' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">WAHS Member Applications</h2>
              <p className="text-sm text-gray-600">Approve or reject membership applications</p>
            </div>
            
            {wahsMembers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No member applications</h3>
                <p className="text-gray-600">When users register, they'll appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {wahsMembers.map((member) => (
                  <div key={member.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">
                          {member.full_name || 'No name provided'}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <div>{member.email}</div>
                          <div>{member.affiliation}</div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.membership_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            member.membership_status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {member.membership_status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Applied: {new Date(member.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Type: {member.membership_type}
                          </span>
                        </div>
                      </div>
                      
                      {member.membership_status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveWahsMember(member.id)}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Reject this membership application?')) {
                                // Reject logic
                              }
                            }}
                            className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {member.bio && (
                      <div className="mt-3 text-sm text-gray-700">
                        <div className="font-medium">Bio:</div>
                        <div className="mt-1">{member.bio}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Congress Submissions</h2>
              <p className="text-sm text-gray-600">Review and manage abstract submissions</p>
            </div>
            
            {congressSubmissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-600">When users submit abstracts, they'll appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {congressSubmissions.map((submission) => (
                  <div key={submission.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{submission.title}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <div>
                            By: {submission.congress_submitters?.full_name || 'Unknown'} • 
                            {submission.congress_submitters?.affiliation || 'No affiliation'}
                          </div>
                          <div>Email: {submission.author_email}</div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                            {submission.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            submission.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                            submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {submission.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Submitted: {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {submission.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => updateSubmissionStatus(submission.id, 'accepted')}
                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {submission.file_url && (
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                          >
                            View File
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700">Abstract:</div>
                      <div className="mt-1 text-sm text-gray-600 line-clamp-3">
                        {submission.abstract}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-4">
                      <button
                        onClick={() => alert('View details coming soon')}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => alert('Email author coming soon')}
                        className="text-sm text-green-600 hover:text-green-500"
                      >
                        Email Author
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-gray-900">{wahsMembers.length}</div>
            <div className="text-sm text-gray-600">Total WAHS Members</div>
            <div className="mt-2 text-xs text-gray-500">
              {wahsMembers.filter(m => m.membership_status === 'pending').length} pending
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-gray-900">{congressSubmissions.length}</div>
            <div className="text-sm text-gray-600">Total Submissions</div>
            <div className="mt-2 text-xs text-gray-500">
              {congressSubmissions.filter(s => s.status === 'submitted').length} under review
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Today's Date</div>
            <div className="mt-2 text-xs text-gray-500">
              System is operational
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
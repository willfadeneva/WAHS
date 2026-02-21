'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { sendSubmissionEditNotification } from '@/lib/email-notifications';

interface Submission {
  id: string;
  title: string;
  abstract: string;
  keywords: string;
  presentation_type: string;
  track: string;
  co_authors: string;
  special_requirements: string;
  file_url: string | null;
  status: string;
  withdrawn: boolean;
  created_at: string;
  last_edited: string;
}

export default function EditSubmissionPage() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    presentation_type: 'oral',
    track: 'general',
    co_authors: '',
    special_requirements: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!loading && (!user || userType !== 'congress')) {
      router.push('/congress/login');
    } else if (user && userType === 'congress') {
      loadSubmission();
    }
  }, [user, userType, loading, router, submissionId]);

  const loadSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .eq('submitter_id', user?.id)
        .single();

      if (error) {
        console.error('Error loading submission:', error);
        setMessage({ type: 'error', text: 'Submission not found or access denied' });
        return;
      }

      if (data) {
        setSubmission(data);
        setFormData({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          presentation_type: data.presentation_type,
          track: data.track,
          co_authors: data.co_authors || '',
          special_requirements: data.special_requirements || ''
        });
        setCurrentFileUrl(data.file_url);
      }
    } catch (error) {
      console.error('Submission load error:', error);
      setMessage({ type: 'error', text: 'Failed to load submission' });
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Only PDF files are allowed' });
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return currentFileUrl;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `abstracts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('abstracts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('abstracts')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload file' });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title' });
      setSaving(false);
      return;
    }

    // Word count validation based on submission type
    const wordCount = formData.abstract.trim().split(/\s+/).length;
    
    if (formData.presentation_type === 'individual' && (wordCount < 300 || wordCount > 500)) {
      setMessage({ type: 'error', text: 'Individual paper abstracts must be 300-500 words' });
      setSaving(false);
      return;
    }
    
    if (formData.presentation_type === 'panel' && (wordCount < 800 || wordCount > 1000)) {
      setMessage({ type: 'error', text: 'Panel proposals must be 800-1,000 words' });
      setSaving(false);
      return;
    }
    
    if ((formData.presentation_type === 'roundtable' || formData.presentation_type === 'workshop') && 
        (wordCount < 500 || wordCount > 700)) {
      setMessage({ type: 'error', text: 'Roundtable/workshop proposals must be 500-700 words' });
      setSaving(false);
      return;
    }

    if (!formData.keywords.trim()) {
      setMessage({ type: 'error', text: 'Please enter keywords' });
      setSaving(false);
      return;
    }

    try {
      // Check if submission can still be edited
      if (submission?.status !== 'submitted' || submission?.withdrawn) {
        setMessage({ type: 'error', text: 'This submission can no longer be edited' });
        setSaving(false);
        return;
      }

      const fileUrl = await uploadFile();
      if (file === null && !currentFileUrl) {
        // No file was selected and there's no existing file
        setMessage({ type: 'error', text: 'Please upload a PDF file' });
        setSaving(false);
        return;
      }

      const finalFileUrl = fileUrl || currentFileUrl;

      // Update submission
      const { error: updateError } = await supabase
        .from('submissions')
        .update({
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords,
          presentation_type: formData.presentation_type,
          track: formData.track,
          co_authors: formData.co_authors,
          special_requirements: formData.special_requirements,
          file_url: finalFileUrl,
          last_edited: new Date().toISOString()
        })
        .eq('id', submissionId)
        .eq('submitter_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Send email notification
      if (user?.id) {
        try {
          await sendSubmissionEditNotification(user.id, submissionId);
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the update if email fails
        }
      }

      setMessage({ 
        type: 'success', 
        text: 'Submission updated successfully! You will receive a confirmation email.' 
      });

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/congress/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: 'Failed to update submission. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Submission Not Found</h1>
          <p className="text-gray-600 mb-4">The submission you're trying to edit doesn't exist or you don't have access.</p>
          <Link
            href="/congress/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (submission.status !== 'submitted' || submission.withdrawn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Cannot Edit Submission</h1>
          <p className="text-gray-600 mb-4">
            This submission {submission.withdrawn ? 'has been withdrawn' : `has been ${submission.status}`} and can no longer be edited.
          </p>
          <Link
            href="/congress/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Submission</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Edit your research abstract for Congress 2026
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Submission ID: {submissionId}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/congress/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Title of your research"
                />
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">
                Abstract/Proposal Text *
              </label>
              <div className="mt-1">
                <textarea
                  id="abstract"
                  name="abstract"
                  rows={8}
                  value={formData.abstract}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Provide your abstract or proposal text according to the word count requirements..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.abstract.length} characters
                {formData.presentation_type === 'individual' && ' (300-500 words required)'}
                {formData.presentation_type === 'panel' && ' (800-1,000 words required)'}
                {(formData.presentation_type === 'roundtable' || formData.presentation_type === 'workshop') && ' (500-700 words required)'}
              </p>
            </div>

            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                Keywords *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="keywords"
                  id="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., K-pop, Korean drama, Hallyu, Cultural studies"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
            </div>

            {/* Presentation Type */}
            <div>
              <label htmlFor="presentation_type" className="block text-sm font-medium text-gray-700">
                Submission Type *
              </label>
              <div className="mt-1">
                <select
                  id="presentation_type"
                  name="presentation_type"
                  value={formData.presentation_type}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="individual">Individual Paper Abstract (300-500 words)</option>
                  <option value="panel">Full Panel Proposal (800-1,000 words)</option>
                  <option value="roundtable">Roundtable Proposal (500-700 words)</option>
                  <option value="workshop">Workshop Proposal (500-700 words)</option>
                </select>
              </div>
            </div>

            {/* Track */}
            <div>
              <label htmlFor="track" className="block text-sm font-medium text-gray-700">
                Conference Track *
              </label>
              <div className="mt-1">
                <select
                  id="track"
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="track1">Track 1: Cultural Dynamism (Annual Theme)</option>
                  <option value="track2">Track 2: Open Topics in Hallyu Studies</option>
                </select>
              </div>
            </div>

            {/* Co-authors */}
            <div>
              <label htmlFor="co_authors" className="block text-sm font-medium text-gray-700">
                Co-authors
              </label>
              <div className="mt-1">
                <textarea
                  id="co_authors"
                  name="co_authors"
                  rows={2}
                  value={formData.co_authors}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="List co-authors with their affiliations (one per line)"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional. One author per line with affiliation in parentheses</p>
            </div>

            {/* Special Requirements */}
            <div>
              <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700">
                Special Requirements
              </label>
              <div className="mt-1">
                <textarea
                  id="special_requirements"
                  name="special_requirements"
                  rows={2}
                  value={formData.special_requirements}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Any special requirements for your presentation"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional. E.g., accessibility needs, equipment requirements</p>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Abstract File (PDF) *
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Maximum file size: 5MB. Only PDF files accepted.
              </p>
              {currentFileUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current file:</p>
                  <a
                    href={currentFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Download current PDF
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep current file. Upload a new file to replace it.
                  </p>
                </div>
              )}
              {file && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">New file selected:</p>
                  <p className="text-sm text-green-600">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <Link
                  href="/congress/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900">Editing Guidelines</h3>
          <ul className="mt-2 text-sm text-blue-800 space-y-1">
            <li>• You can edit your submission until it's reviewed by the committee</li>
            <li>• Once accepted or rejected, editing is no longer possible</li>
            <li>• Withdrawn submissions cannot be edited</li>
            <li>• All edits will be logged and reviewers notified</li>
            <li>• You will receive an email confirmation after editing</li>
          </ul>
          <div className="mt-4">
            <Link
              href="/congress/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
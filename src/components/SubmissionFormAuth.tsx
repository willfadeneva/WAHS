'use client';
import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface CoAuthor {
  name: string;
  email: string;
  affiliation: string;
}

export default function SubmissionFormAuth({ year }: { year: number }) {
  const { user, userType, profile } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user || userType !== 'congress') {
      router.push('/congress/login?next=/2026/submissions');
    }
  }, [user, userType, router]);

  const addCoAuthor = () => setCoAuthors([...coAuthors, { name: '', email: '', affiliation: '' }]);
  const removeCoAuthor = (i: number) => setCoAuthors(coAuthors.filter((_, idx) => idx !== i));
  const updateCoAuthor = (i: number, field: keyof CoAuthor, value: string) => {
    const updated = [...coAuthors];
    updated[i][field] = value;
    setCoAuthors(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please upload PDF or Word documents only');
        return;
      }
      setFile(selectedFile);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!user || userType !== 'congress') {
      setError('Please login to submit an abstract');
      return;
    }

    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    let fileUrl = '';

    // Upload file if provided
    if (file) {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `abstracts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('abstracts')
        .upload(filePath, file);

      if (uploadError) {
        setError('File upload failed: ' + uploadError.message);
        setLoading(false);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('abstracts')
        .getPublicUrl(filePath);
      
      fileUrl = publicUrl;
      setUploading(false);
    }

    const data = {
      type: form.get('type') as string,
      title: form.get('title') as string,
      track: form.get('track') as string,
      abstract: form.get('abstract') as string,
      keywords: form.get('keywords') as string,
      author_name: profile?.full_name || form.get('author_name') as string,
      author_email: user.email,
      author_affiliation: profile?.affiliation || form.get('author_affiliation') as string,
      author_bio: form.get('author_bio') as string,
      co_authors: coAuthors.filter(c => c.name.trim()),
      special_requirements: form.get('special_requirements') as string || '',
      submitter_id: user.id,
      file_url: fileUrl,
      status: 'submitted'
    };

    // Validate
    const required = ['type', 'title', 'track', 'abstract', 'keywords', 'author_bio'];
    for (const field of required) {
      if (!data[field as keyof typeof data]) {
        setError(`Please fill in all required fields.`);
        setLoading(false);
        return;
      }
    }

    const { error: dbError } = await supabase.from('submissions').insert([{ ...data, congress_year: year }]);

    if (dbError) {
      setError('Submission failed. Please try again or email wahskorea@gmail.com.');
      console.error(dbError);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (!user || userType !== 'congress') {
    return (
      <div className="submission-form-container">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">Please login to submit an abstract.</p>
          <button
            onClick={() => router.push('/congress/login?next=/2026/submissions')}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login to Submit
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="submission-form-container">
        <div className="form-success">
          <div className="form-success-icon">✅</div>
          <h3>Submission Received!</h3>
          <p>Thank you for your submission to WAHS 2026. You will receive notification of acceptance by April 30, 2026.</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/congress/dashboard')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              View in Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-form-container">
      <div className="submission-form-header">
        <span className="section-label">Submission Form</span>
        <h3 className="submission-form-title">Submit Your Proposal</h3>
        <p className="submission-form-desc">
          Complete all fields below. Fields marked with * are required.
          <br />
          <span className="text-sm">Logged in as: {user.email}</span>
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 font-medium">Error</div>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="submission-form-body">
        {/* File Upload */}
        <div className="form-group">
          <label className="form-label">Abstract File (Optional)</label>
          <div className="mt-2">
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload PDF or Word document (max 5MB). If you upload a file, you can keep the abstract text field brief.
            </p>
            {file && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <div className="text-green-600 mr-2">✓</div>
                  <div>
                    <div className="font-medium text-green-800">File selected: {file.name}</div>
                    <div className="text-sm text-green-700">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pre-filled author info from profile */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Author Name *</label>
            <input
              type="text"
              name="author_name"
              defaultValue={profile?.full_name || ''}
              required
              className="form-input"
              placeholder="Your full name"
            />
            <p className="text-xs text-gray-500 mt-1">From your profile. You can edit it here.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Author Email *</label>
            <input
              type="email"
              name="author_email"
              defaultValue={user.email}
              readOnly
              className="form-input bg-gray-50"
              placeholder="Your email"
            />
            <p className="text-xs text-gray-500 mt-1">Your login email (cannot be changed)</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Author Affiliation *</label>
          <input
            type="text"
            name="author_affiliation"
            defaultValue={profile?.affiliation || ''}
            required
            className="form-input"
            placeholder="University/Organization"
          />
        </div>

        {/* Rest of the form remains similar */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Submission Type *</label>
            <select name="type" className="form-select" required>
              <option value="">Select type...</option>
              <option value="individual_paper">Individual Paper (300–500 words)</option>
              <option value="full_panel">Full Panel (800–1,000 words)</option>
              <option value="roundtable">Roundtable (500–700 words)</option>
              <option value="workshop">Workshop (500–700 words)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Track *</label>
            <select name="track" className="form-select" required>
              <option value="">Select track...</option>
              <option value="track1">Track 1: Cultural Dynamism (Annual Theme)</option>
              <option value="track2">Track 2: Open Topics in Hallyu Studies</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Presentation/Panel Title *</label>
          <input
            type="text"
            name="title"
            required
            className="form-input"
            placeholder="Title of your presentation or panel"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Abstract *</label>
          <textarea
            name="abstract"
            rows={6}
            required
            className="form-textarea"
            placeholder="Enter your abstract here (300–1000 words depending on submission type)..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Word count will be checked during review. Follow the word limits for your submission type.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Keywords *</label>
          <input
            type="text"
            name="keywords"
            required
            className="form-input"
            placeholder="5–7 keywords separated by commas"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Brief Bio (100 words) *</label>
          <textarea
            name="author_bio"
            rows={3}
            required
            className="form-textarea"
            placeholder="Brief biography (100 words maximum)..."
          />
        </div>

        {/* Co-authors section */}
        <div className="form-group">
          <div className="flex justify-between items-center mb-2">
            <label className="form-label">Co-authors (Optional)</label>
            <button
              type="button"
              onClick={addCoAuthor}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              + Add Co-author
            </button>
          </div>
          
          {coAuthors.map((coAuthor, i) => (
            <div key={i} className="mb-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Co-author {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCoAuthor(i)}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={coAuthor.name}
                  onChange={(e) => updateCoAuthor(i, 'name', e.target.value)}
                  className="form-input"
                  placeholder="Full name"
                />
                <input
                  type="email"
                  value={coAuthor.email}
                  onChange={(e) => updateCoAuthor(i, 'email', e.target.value)}
                  className="form-input"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={coAuthor.affiliation}
                  onChange={(e) => updateCoAuthor(i, 'affiliation', e.target.value)}
                  className="form-input"
                  placeholder="Affiliation"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Special Requirements</label>
          <textarea
            name="special_requirements"
            rows={2}
            className="form-textarea"
            placeholder="Any special requirements (accessibility, equipment, scheduling conflicts)..."
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            disabled={loading || uploading}
            className="submit-button"
          >
            {loading ? 'Submitting...' : uploading ? 'Uploading file...' : 'Submit Abstract'}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            By submitting, you confirm that this work is original and has not been published elsewhere.
          </p>
        </div>
      </form>
    </div>
  );
}
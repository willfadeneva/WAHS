import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase';
import { sendSubmissionConfirmation } from '@/lib/email';

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET(request: NextRequest, { params }: { params: Promise<{ year: string }> }) {
  try {
    const { year: yearStr } = await params;
    const year = parseInt(yearStr);
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('congress_year', year)
      .order('submitted_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET submissions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ year: string }> }) {
  try {
    const { year: yearStr } = await params;
    const year = parseInt(yearStr);
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let pdfUrl: string | null = null;
    let fields: Record<string, string> = {};
    let coAuthors: { name: string; email: string; affiliation: string }[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      // Extract text fields
      const textFields = ['title', 'abstract', 'keywords', 'presentation_type', 'track',
        'author_email', 'author_name', 'author_institution', 'author_bio', 'special_requirements'];
      for (const field of textFields) {
        fields[field] = formData.get(field) as string || '';
      }

      // Parse co_authors
      const coAuthorsStr = formData.get('co_authors') as string;
      if (coAuthorsStr) {
        try { coAuthors = JSON.parse(coAuthorsStr); } catch { coAuthors = []; }
      }

      // Handle PDF upload
      const pdfFile = formData.get('pdf') as File | null;
      if (pdfFile && pdfFile.size > 0) {
        if (pdfFile.size > MAX_PDF_SIZE) {
          return NextResponse.json({ error: 'PDF file must be under 5MB.' }, { status: 400 });
        }
        const adminClient = createAdminClient();
        const fileName = `submissions/${year}/${user.id}/${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const arrayBuffer = await pdfFile.arrayBuffer();
        const { error: uploadError } = await adminClient.storage
          .from('submissions')
          .upload(fileName, arrayBuffer, { contentType: 'application/pdf', upsert: false });

        if (uploadError) {
          console.error('PDF upload error:', uploadError);
          // Non-fatal — continue without PDF
        } else {
          const { data: urlData } = adminClient.storage.from('submissions').getPublicUrl(fileName);
          pdfUrl = urlData.publicUrl;
        }
      }
    } else {
      // JSON body (no PDF)
      const body = await request.json();
      fields = body;
      coAuthors = body.co_authors || [];
    }

    // Validate required fields
    if (!fields.title || !fields.abstract || !fields.presentation_type) {
      return NextResponse.json({ error: 'Title, abstract, and presentation type are required.' }, { status: 400 });
    }
    if (fields.abstract.length < 200) {
      return NextResponse.json({ error: 'Abstract must be at least 200 characters.' }, { status: 400 });
    }

    const submissionData = {
      congress_year: year,
      user_id: user.id,
      author_email: fields.author_email || user.email,
      author_name: fields.author_name || '',
      author_institution: fields.author_institution || '',
      author_bio: fields.author_bio || '',
      title: fields.title,
      abstract: fields.abstract,
      keywords: fields.keywords || '',
      presentation_type: fields.presentation_type,
      track: fields.track || '',
      co_authors: coAuthors,
      special_requirements: fields.special_requirements || '',
      pdf_url: pdfUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Send confirmation email (non-blocking)
    const email = fields.author_email || user.email || '';
    const name = fields.author_name || 'Author';
    sendSubmissionConfirmation(email, name, fields.title, year).catch(console.error);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('POST submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ year: string }> }) {
  try {
    const { year: yearStr } = await params;
    const year = parseInt(yearStr);
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let id: string = '';
    let pdfUrl: string | null = null;
    let fields: Record<string, string> = {};
    let coAuthors: { name: string; email: string; affiliation: string }[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id') as string;
      const textFields = ['title', 'abstract', 'keywords', 'presentation_type', 'track',
        'author_name', 'author_institution', 'author_bio', 'special_requirements'];
      for (const field of textFields) {
        fields[field] = formData.get(field) as string || '';
      }
      const coAuthorsStr = formData.get('co_authors') as string;
      if (coAuthorsStr) {
        try { coAuthors = JSON.parse(coAuthorsStr); } catch { coAuthors = []; }
      }
      const pdfFile = formData.get('pdf') as File | null;
      if (pdfFile && pdfFile.size > 0) {
        if (pdfFile.size > MAX_PDF_SIZE) {
          return NextResponse.json({ error: 'PDF file must be under 5MB.' }, { status: 400 });
        }
        const adminClient = createAdminClient();
        const fileName = `submissions/${year}/${user.id}/${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const arrayBuffer = await pdfFile.arrayBuffer();
        const { error: uploadError } = await adminClient.storage
          .from('submissions').upload(fileName, arrayBuffer, { contentType: 'application/pdf' });
        if (!uploadError) {
          const { data: urlData } = adminClient.storage.from('submissions').getPublicUrl(fileName);
          pdfUrl = urlData.publicUrl;
        }
      }
    } else {
      const body = await request.json();
      id = body.id;
      fields = body;
      coAuthors = body.co_authors || [];
    }

    if (!id) return NextResponse.json({ error: 'Submission ID required.' }, { status: 400 });

    const updates: Record<string, unknown> = {
      title: fields.title,
      abstract: fields.abstract,
      keywords: fields.keywords,
      presentation_type: fields.presentation_type,
      track: fields.track,
      author_name: fields.author_name,
      author_institution: fields.author_institution,
      author_bio: fields.author_bio,
      special_requirements: fields.special_requirements,
      co_authors: coAuthors,
      updated_at: new Date().toISOString(),
    };
    if (pdfUrl) updates.pdf_url = pdfUrl;

    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('PATCH submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Submission ID required.' }, { status: 400 });

    const { error } = await supabase
      .from('submissions')
      .update({ status: 'withdrawn', withdrawn_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

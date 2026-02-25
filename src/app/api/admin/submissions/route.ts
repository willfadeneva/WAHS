import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { sendSubmissionUpdate } from '@/lib/email';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const track = searchParams.get('track');
  const type = searchParams.get('type');
  const year = searchParams.get('year');

  let query = supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (year) query = query.eq('congress_year', parseInt(year));
  if (status) query = query.eq('status', status);
  if (track) query = query.eq('track', track);
  if (type) query = query.eq('presentation_type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, status, reviewer_notes } = body;

  if (!id) return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (status) {
    updates.status = status;
    if (['accepted', 'rejected', 'under_review'].includes(status)) {
      updates.reviewer_notes = reviewer_notes || null;
    }
  }

  if (reviewer_notes !== undefined) {
    updates.reviewer_notes = reviewer_notes;
  }

  const { data, error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email notification to submitter if status changed
  if (status && data) {
    const sub = data as {
      author_email: string;
      author_name: string;
      title: string;
      congress_year: number;
    };
    sendSubmissionUpdate(
      sub.author_email,
      sub.author_name,
      sub.title,
      status,
      sub.congress_year
    ).catch(console.error);
  }

  return NextResponse.json({ success: true, data });
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null;
  }
  return user;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');

  let query = supabase
    .from('wahs_members')
    .select('*')
    .order('joined_at', { ascending: false });

  if (status) query = query.eq('membership_status', status);
  if (type) query = query.eq('membership_type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerClient();
  const admin = await verifyAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, membership_status } = body;

  if (!id || !membership_status) {
    return NextResponse.json({ error: 'Missing id or membership_status' }, { status: 400 });
  }

  const validStatuses = ['pending', 'active', 'expired'];
  if (!validStatuses.includes(membership_status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('wahs_members')
    .update({ membership_status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: adminRecord } = await supabase.from('admin_users').select('id').eq('user_id', user.id).maybeSingle();
  if (!adminRecord && !ADMIN_EMAILS.includes(user.email || '')) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type   = searchParams.get('type');

  const supabase = createAdminClient();
  let query = supabase
    .from('wahs_members')
    .select('*')
    .order('joined_at', { ascending: false });

  if (status) query = query.eq('membership_status', status);
  if (type)   query = query.eq('membership_type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, membership_status } = await request.json();
  if (!id || !membership_status) {
    return NextResponse.json({ error: 'Missing id or membership_status' }, { status: 400 });
  }

  const validStatuses = ['pending', 'active', 'expired'];
  if (!validStatuses.includes(membership_status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const now = new Date();

  // Set expires_at 1 year from now when activating; clear it when expiring
  const updates: Record<string, unknown> = {
    membership_status,
    updated_at: now.toISOString(),
  };
  if (membership_status === 'active') {
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);
    updates.expires_at = expires.toISOString();
  } else if (membership_status === 'expired') {
    updates.expires_at = now.toISOString(); // mark as expired now
  }

  const { data, error } = await supabase
    .from('wahs_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

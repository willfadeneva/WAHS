import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Check admin_users table OR hardcoded list
  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  return !!adminRecord || ADMIN_EMAILS.includes(user.email || '');
}

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createAdminClient();

  const [regResult, subResult, memResult] = await Promise.all([
    db
      .from('congress_registrations')
      .select('*')
      .eq('congress_year', 2026)
      .order('created_at', { ascending: false }),
    db
      .from('submissions')
      .select('*')
      .eq('congress_year', 2026)
      .order('submitted_at', { ascending: false }),
    db
      .from('wahs_members')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  if (regResult.error || subResult.error || memResult.error) {
    const err = regResult.error || subResult.error || memResult.error;
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }

  return NextResponse.json({
    registrations: regResult.data,
    submissions: subResult.data,
    members: memResult.data,
  });
}

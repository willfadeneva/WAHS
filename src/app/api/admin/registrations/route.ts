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

// PATCH: Manually confirm payment for a congress registration
export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, amount_paid, paypal_transaction_id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('congress_registrations')
    .update({
      amount_paid: amount_paid ?? 0,
      paypal_transaction_id: paypal_transaction_id ?? 'MANUAL',
    })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data });
}

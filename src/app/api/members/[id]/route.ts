import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();
    const update: Record<string, unknown> = {};
    if (body.membership_status) update.membership_status = body.membership_status;
    if (body.expires_at) update.expires_at = body.expires_at;
    if (body.paypal_transaction_id) update.paypal_transaction_id = body.paypal_transaction_id;
    const { data, error } = await supabase.from('wahs_members').update(update).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createServerClient();
    const update: Record<string, unknown> = {};
    if (body.paypal_transaction_id) update.paypal_transaction_id = body.paypal_transaction_id;
    if (body.amount_paid !== undefined) update.amount_paid = body.amount_paid;
    if (body.notes !== undefined) update.notes = body.notes;
    const { data, error } = await supabase.from('congress_registrations').update(update).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

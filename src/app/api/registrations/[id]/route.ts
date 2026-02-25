import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createServerClient();
    const update: Record<string, unknown> = {};
    if (body.payment_status) update.payment_status = body.payment_status;
    if (body.payment_status === 'confirmed') update.payment_date = new Date().toISOString();
    if (body.notes !== undefined) update.notes = body.notes;
    const { data, error } = await supabase.from('registrations').update(update).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  
  let query = supabase.from('submissions').select('*').order('submitted_at', { ascending: false });
  
  const status = searchParams.get('status');
  const track = searchParams.get('track');
  const type = searchParams.get('type');
  
  if (status) query = query.eq('status', status);
  if (track) query = query.eq('track', track);
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();
  const { id, ...updates } = body;
  
  if (updates.status && ['accepted', 'rejected', 'revision'].includes(updates.status)) {
    updates.reviewed_at = new Date().toISOString();
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('submissions').update(updates).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

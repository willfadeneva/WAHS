import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('speakers').select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  const body = await request.json();
  const { data, error } = await supabase.from('speakers').insert([body]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createServerClient();
  const body = await request.json();
  const { id, ...updates } = body;
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('speakers').update(updates).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerClient();
  const { id } = await request.json();
  const { error } = await supabase.from('speakers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

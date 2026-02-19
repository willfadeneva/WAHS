import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default async function Home() {
  // Find the latest active congress year
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data } = await supabase
    .from('congresses')
    .select('year')
    .eq('is_active', true)
    .order('year', { ascending: false })
    .limit(1)
    .single();

  const year = data?.year || 2026;
  redirect(`/${year}`);
}

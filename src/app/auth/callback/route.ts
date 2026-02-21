import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const userType = user.user_metadata?.user_type || 'congress';
        
        // Create profile if it doesn't exist
        if (userType === 'congress') {
          const { data: existing } = await supabase
            .from('congress_submitters')
            .select('id')
            .eq('id', user.id)
            .single();
            
          if (!existing) {
            await supabase.from('congress_submitters').insert({
              id: user.id,
              email: user.email,
              full_name: '',
              affiliation: ''
            });
          }
        } else if (userType === 'wahs') {
          const { data: existing } = await supabase
            .from('wahs_members')
            .select('id')
            .eq('id', user.id)
            .single();
            
          if (!existing) {
            await supabase.from('wahs_members').insert({
              id: user.id,
              email: user.email,
              full_name: '',
              affiliation: '',
              membership_type: 'free',
              membership_status: 'pending'
            });
          }
        }
      }
      
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  // Return to home page if error
  return NextResponse.redirect(requestUrl.origin);
}
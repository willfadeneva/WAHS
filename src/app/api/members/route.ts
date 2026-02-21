import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, affiliation, country, membership_type, year } = body;
    
    // Validate required fields
    if (!name || !email || !membership_type || !year) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, membership_type, year' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate membership type
    const validTypes = ['professional', 'non_professional'];
    if (!validTypes.includes(membership_type)) {
      return NextResponse.json({ 
        error: 'Invalid membership type. Must be "professional" or "non_professional"' 
      }, { status: 400 });
    }

    console.log('Processing membership application:', {
      name,
      email: email.toLowerCase(),
      membership_type,
      year
    });

    // Check if member already exists
    const { data: existingMember, error: checkError } = await supabase
      .from('wahs_members')
      .select('id, membership_type, payment_status')
      .eq('email', email.toLowerCase())
      .eq('year', parseInt(year))
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') { // Ignore "no rows" error
      console.error('Error checking existing member:', checkError);
    }

    if (existingMember) {
      // Member already exists
      if (existingMember.payment_status === 'paid') {
        return NextResponse.json({ 
          error: 'You already have an active membership for this year',
          existingMember
        }, { status: 400 });
      } else if (existingMember.payment_status === 'pending') {
        // Update existing pending application
        const { data: updatedMember, error: updateError } = await supabase
          .from('wahs_members')
          .update({
            name,
            affiliation,
            country,
            membership_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMember.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating existing member:', updateError);
          return NextResponse.json({ 
            error: 'Failed to update membership application' 
          }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Membership application updated',
          member: updatedMember,
          isUpdate: true
        }, { status: 200 });
      }
    }

    // Create new member application
    const { data: newMember, error: insertError } = await supabase
      .from('wahs_members')
      .insert([{
        name,
        email: email.toLowerCase(),
        affiliation,
        country,
        membership_type,
        year: parseInt(year),
        payment_status: 'pending',
        approval_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating member:', insertError);
      
      // Check if it's a duplicate key error
      if (insertError.code === '23505') { // unique_violation
        return NextResponse.json({ 
          error: 'A membership application with this email already exists for this year' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to create membership application' 
      }, { status: 500 });
    }

    console.log('Membership application created:', newMember.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Membership application submitted successfully',
      member: newMember,
      isUpdate: false
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in members API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');
    
    let query = supabase
      .from('wahs_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (year) {
      query = query.eq('year', parseInt(year));
    }
    
    if (status) {
      query = query.eq('payment_status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch members' 
      }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in members GET API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
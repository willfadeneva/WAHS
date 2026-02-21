import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    
    // For now, accept any authenticated request
    // In production, you would validate JWT token
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Authentication required. Please login to submit abstracts.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Basic validation
    const requiredFields = ['title', 'abstract', 'year'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if user agreed to terms
    if (!body.agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Get user profile from database
    const { data: userProfile, error: profileError } = await supabase
      .from('congress_submitters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'User profile not found. Please complete your profile first.' },
        { status: 400 }
      );
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found. Please complete your profile first.' },
        { status: 400 }
      );
    }

    // Save submission to database
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        title: body.title,
        abstract: body.abstract,
        keywords: body.keywords,
        presentation_type: body.presentationType,
        track: body.track,
        submitter_id: userId,
        author_email: userEmail,
        author_name: userProfile.full_name || `${userProfile.first_name} ${userProfile.last_name}`,
        author_affiliation: userProfile.affiliation,
        congress_year: body.year,
        status: 'submitted',
        created_at: new Date().toISOString(),
        last_edited: new Date().toISOString()
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Database error:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission to database' },
        { status: 500 }
      );
    }

    // Log for debugging
    console.log('Abstract submission saved:', {
      submissionId: submission.id,
      title: body.title,
      userEmail: userEmail,
      year: body.year,
      timestamp: new Date().toISOString()
    });

    // TODO: Send confirmation email
    // TODO: Notify admins

    return NextResponse.json(
      { 
        success: true, 
        message: 'Abstract submitted successfully',
        submissionId: submission.id,
        submission: {
          id: submission.id,
          title: submission.title,
          status: submission.status,
          submittedAt: submission.submitted_at
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
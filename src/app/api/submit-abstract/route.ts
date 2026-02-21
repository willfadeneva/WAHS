import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    const requiredFields = ['title', 'abstract', 'firstName', 'lastName', 'email', 'country', 'year'];
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

    // For now, just log the submission and return success
    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admins
    
    console.log('Abstract submission received:', {
      title: body.title,
      email: body.email,
      year: body.year,
      timestamp: new Date().toISOString()
    });

    // Simulate saving to database (commented out for now)
    /*
    const { error } = await supabase
      .from('congress_submissions')
      .insert({
        title: body.title,
        abstract: body.abstract,
        keywords: body.keywords,
        presentation_type: body.presentationType,
        track: body.track,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email.toLowerCase(),
        affiliation: body.affiliation,
        country: body.country,
        bio: body.bio,
        year: body.year,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save submission to database' },
        { status: 500 }
      );
    }
    */

    return NextResponse.json(
      { 
        success: true, 
        message: 'Abstract submitted successfully',
        submissionId: `sub_${Date.now()}`
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
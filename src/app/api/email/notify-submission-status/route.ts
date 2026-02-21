import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toEmail, toName, submissionTitle, submissionId, status, congressYear } = body;

    if (!toEmail || !submissionTitle || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine email subject and content based on status
    const isAccepted = status === 'accepted';
    const subject = isAccepted 
      ? `WAHS Congress ${congressYear} - Submission Accepted`
      : `WAHS Congress ${congressYear} - Submission Decision`;

    const statusText = isAccepted ? 'accepted' : 'not selected';
    const actionText = isAccepted ? 'Congratulations!' : 'Thank you for your submission.';

    // TEMPORARY: Log email instead of sending
    console.log('Email notification logged:', {
      toEmail,
      toName,
      submissionTitle,
      submissionId,
      status,
      congressYear,
      subject,
      timestamp: new Date().toISOString()
    });

    // Return success without actually sending email
    return NextResponse.json({
      success: true,
      message: 'Email logged (Resend API key not configured)',
      logged: true,
      email: toEmail,
      status,
      subject,
      wouldSend: true
    });
    
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
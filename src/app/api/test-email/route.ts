import { sendEmail } from '@/lib/email-notifications';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'charanjotsingh@gmail.com';
  const template = searchParams.get('template') || 'MAGIC_LINK_CONGRESS';

  try {
    // Test different templates
    const templateData: any = {};
    
    switch (template) {
      case 'SUBMISSION_CONFIRMATION':
        templateData.name = 'Test User';
        templateData.submissionId = 'TEST-123';
        break;
      case 'MAGIC_LINK_CONGRESS':
        templateData.magicLink = 'https://congress.iwahs.org/auth/magic-link?token=test123';
        templateData.expiresIn = '1 hour';
        break;
      case 'MEMBERSHIP_APPLICATION':
        templateData.name = 'Test Member';
        templateData.membershipType = 'professional';
        break;
      default:
        templateData.name = 'Test User';
    }

    const result = await sendEmail(email, template as any, templateData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email sent to ${email} using template ${template}`,
        data: templateData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to send email: ${result.error}`,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error testing email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
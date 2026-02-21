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

    // TEMPORARY FIX: Log email instead of sending
    console.log('Email notification (would send):', {
      toEmail,
      submissionTitle,
      status,
      congressYear,
      timestamp: new Date().toISOString()
    });

    // Return success without actually sending email
    return NextResponse.json({
      success: true,
      message: 'Email logged (Resend API key not configured)',
      logged: true,
      email: toEmail,
      status
    });
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0047A0 0%, #CD2E3A 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .status-box { 
              background: ${isAccepted ? '#d4edda' : '#f8d7da'}; 
              border: 1px solid ${isAccepted ? '#c3e6cb' : '#f5c6cb'};
              color: ${isAccepted ? '#155724' : '#721c24'};
              padding: 15px; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .button { 
              display: inline-block; 
              background: #0047A0; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              margin: 10px 0;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>WAHS Congress ${congressYear}</h1>
              <p>Cultural Dynamism in the Digital Age</p>
            </div>
            
            <div class="content">
              <h2>${actionText}</h2>
              
              <div class="status-box">
                <h3>Submission Status: <strong>${statusText.toUpperCase()}</strong></h3>
                <p><strong>Title:</strong> ${submissionTitle}</p>
                <p><strong>Submission ID:</strong> ${submissionId}</p>
              </div>
              
              ${isAccepted ? `
                <h3>📚 Publication Opportunities</h3>
                <p>Selected papers from the congress will be considered for publication in:</p>
                <ul>
                  <li><strong>SOCIÉTÉS</strong> - Peer-reviewed, A&HCI indexed (special issue)</li>
                  <li><strong>HALLYU</strong> - WAHS flagship journal (special issue)</li>
                  <li><strong>BRILL</strong> - Leading academic publisher (edited volume)</li>
                  <li><strong>WAHS Congress Proceedings</strong> - Open access publication</li>
                </ul>
                
                <h3>Next Steps:</h3>
                <p>To present your paper at the congress, please complete your registration:</p>
                <a href="https://congress.iwahs.org/${congressYear}/registration" class="button">
                  Register for Congress ${congressYear}
                </a>
                <p><em>Early bird registration available until May 15, ${congressYear}</em></p>
              ` : `
                <p>After careful review, we regret to inform you that your submission was not selected for this year's congress.</p>
                <p>We received a large number of high-quality submissions and had to make difficult decisions.</p>
                <p>We encourage you to submit again for future congresses.</p>
                
                <h3>Stay Connected:</h3>
                <p>Consider joining WAHS to stay updated on future opportunities:</p>
                <a href="https://congress.iwahs.org/membership" class="button">
                  Join WAHS Membership
                </a>
              `}
              
              <div class="footer">
                <p>Best regards,<br>
                WAHS Congress Committee</p>
                <p>Contact: <a href="mailto:wahskorea@gmail.com">wahskorea@gmail.com</a></p>
                <p>Website: <a href="https://congress.iwahs.org">congress.iwahs.org</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
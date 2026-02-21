import { supabase } from './supabase';

// Email templates
const EMAIL_TEMPLATES = {
  // Congress submission emails
  SUBMISSION_CONFIRMATION: {
    subject: 'WAHS Congress 2026 - Submission Received',
    template: (name: string, submissionId: string) => `
      <h1>Submission Received</h1>
      <p>Dear ${name},</p>
      <p>Thank you for submitting your abstract to the WAHS Congress 2026.</p>
      <p>Your submission ID is: <strong>${submissionId}</strong></p>
      <p>We will review your submission and notify you of the outcome by April 15, 2026.</p>
      <p>You can check your submission status at any time by logging into your dashboard.</p>
      <br>
      <p>Best regards,<br>
      WAHS Congress Committee</p>
    `
  },

  SUBMISSION_APPROVED: {
    subject: 'WAHS Congress 2026 - Submission Approved',
    template: (name: string) => `
      <h1>Submission Approved</h1>
      <p>Dear ${name},</p>
      <p>Congratulations! Your submission to the WAHS Congress 2026 has been approved.</p>
      <p>Please complete your registration by May 15, 2026 to secure your spot.</p>
      <p>Early bird registration is available until May 15, 2026.</p>
      <br>
      <p><a href="https://congress.iwahs.org/2026/registration">Click here to register</a></p>
      <br>
      <p>Best regards,<br>
      WAHS Congress Committee</p>
    `
  },

  SUBMISSION_REJECTED: {
    subject: 'WAHS Congress 2026 - Submission Decision',
    template: (name: string) => `
      <h1>Submission Decision</h1>
      <p>Dear ${name},</p>
      <p>Thank you for your submission to the WAHS Congress 2026.</p>
      <p>After careful review, we regret to inform you that your submission was not selected for this year's congress.</p>
      <p>We received a large number of high-quality submissions and had to make difficult decisions.</p>
      <p>We encourage you to submit again for future congresses.</p>
      <br>
      <p>Best regards,<br>
      WAHS Congress Committee</p>
    `
  },

  // WAHS membership emails
  MEMBERSHIP_APPLICATION: {
    subject: 'WAHS Membership Application Received',
    template: (name: string, membershipType: string) => `
      <h1>Membership Application Received</h1>
      <p>Dear ${name},</p>
      <p>Thank you for applying for ${membershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership with WAHS.</p>
      <p>Your application is currently under review.</p>
      <p>Please complete your payment ($${membershipType === 'professional' ? '250' : '150'}/year) to activate your membership.</p>
      <br>
      <p>You can check your membership status at any time by logging into your dashboard.</p>
      <br>
      <p>Best regards,<br>
      WAHS Membership Committee</p>
    `
  },

  MEMBERSHIP_APPROVED: {
    subject: 'WAHS Membership Approved',
    template: (name: string, membershipType: string) => `
      <h1>Membership Approved</h1>
      <p>Dear ${name},</p>
      <p>Congratulations! Your ${membershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership with WAHS has been approved.</p>
      <p>Your membership is now active and will expire in 1 year.</p>
      <p>You can now access member-only resources and benefits.</p>
      <br>
      <p><a href="https://congress.iwahs.org/wahs/dashboard">Access your member dashboard</a></p>
      <br>
      <p>Best regards,<br>
      WAHS Membership Committee</p>
    `
  },

  MEMBERSHIP_REJECTED: {
    subject: 'WAHS Membership Application Decision',
    template: (name: string) => `
      <h1>Membership Application Decision</h1>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in joining WAHS.</p>
      <p>After reviewing your application, we regret to inform you that it was not approved at this time.</p>
      <p>You may reapply in the future or contact us for more information.</p>
      <br>
      <p>Best regards,<br>
      WAHS Membership Committee</p>
    `
  },

  // Payment emails
  PAYMENT_CONFIRMATION: {
    subject: 'WAHS Membership Payment Confirmed',
    template: (name: string, membershipType: string, paymentId: string) => `
      <h1>Payment Confirmed</h1>
      <p>Dear ${name},</p>
      <p>Your ${membershipType === 'professional' ? 'Professional' : 'Non-Professional'} membership payment has been confirmed.</p>
      <p>Payment ID: <strong>${paymentId}</strong></p>
      <p>Your membership is now active and will expire in 1 year.</p>
      <br>
      <p><a href="https://congress.iwahs.org/wahs/dashboard">Access your member dashboard</a></p>
      <br>
      <p>Best regards,<br>
      WAHS</p>
    `
  },

  // Password reset
  PASSWORD_RESET: {
    subject: 'WAHS - Password Reset Request',
    template: (name: string, resetLink: string) => `
      <h1>Password Reset</h1>
      <p>Dear ${name},</p>
      <p>You requested a password reset for your WAHS account.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour.</p>
      <br>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>
      WAHS</p>
    `
  },

  // Magic link emails
  MAGIC_LINK_CONGRESS: {
    subject: 'WAHS Congress 2026 - Login Link',
    template: (magicLink: string, expiresIn: string) => `
      <h1>Login to WAHS Congress 2026</h1>
      <p>Click the link below to log in to your WAHS Congress account:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link will expire in ${expiresIn}.</p>
      <br>
      <p>If you didn't request this login link, please ignore this email.</p>
      <br>
      <p>Best regards,<br>
      WAHS Congress Committee</p>
    `
  },

  MAGIC_LINK_WAHS: {
    subject: 'WAHS Membership - Login Link',
    template: (magicLink: string, expiresIn: string) => `
      <h1>Login to WAHS Membership</h1>
      <p>Click the link below to log in to your WAHS Membership account:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link will expire in ${expiresIn}.</p>
      <br>
      <p>If you didn't request this login link, please ignore this email.</p>
      <br>
      <p>Best regards,<br>
      WAHS Membership Committee</p>
    `
  }
};

// Email sending function with Resend integration
export async function sendEmail(
  to: string,
  templateKey: keyof typeof EMAIL_TEMPLATES,
  templateData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const template = EMAIL_TEMPLATES[templateKey];
    const subject = template.subject;
    
    // Generate HTML content
    const html = typeof template.template === 'function' 
      ? template.template(...Object.values(templateData))
      : template.template;

    console.log(`[EMAIL] Sending ${templateKey} to ${to}`);
    
    // Try Resend first (if configured)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'WAHS <noreply@wahs.org>',
            to: [to],
            subject,
            html,
            reply_to: 'wahskorea@gmail.com',
          }),
        });

        if (resendResponse.ok) {
          const data = await resendResponse.json();
          console.log(`[EMAIL] Sent via Resend: ${data.id}`);
          
          // Store email in database for tracking
          await supabase.from('email_logs').insert({
            to_email: to,
            template: templateKey,
            subject,
            sent_at: new Date().toISOString(),
            status: 'sent',
            provider: 'resend',
            provider_id: data.id
          });

          return { success: true };
        }
      }
    } catch (resendError) {
      console.warn('Resend failed, falling back to logging:', resendError);
    }

    // Fallback: Log email (for development/testing)
    console.log(`[EMAIL LOGGED] To: ${to}, Subject: ${subject}`);
    
    // Store email in database as logged (not sent)
    await supabase.from('email_logs').insert({
      to_email: to,
      template: templateKey,
      subject,
      sent_at: new Date().toISOString(),
      status: 'logged',
      provider: 'log'
    });

    return { success: true };
    
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Store failure in database
    try {
      await supabase.from('email_logs').insert({
        to_email: to,
        template: templateKey,
        subject: EMAIL_TEMPLATES[templateKey].subject,
        sent_at: new Date().toISOString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (dbError) {
      console.error('Failed to log email error:', dbError);
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Specific email sending functions
export async function sendSubmissionConfirmation(
  submitterId: string,
  submissionId: string
): Promise<void> {
  const { data: submitter } = await supabase
    .from('congress_submitters')
    .select('full_name, email')
    .eq('id', submitterId)
    .single();

  if (submitter) {
    await sendEmail(submitter.email, 'SUBMISSION_CONFIRMATION', {
      name: submitter.full_name,
      submissionId
    });
  }
}

export async function sendSubmissionApproval(submitterId: string): Promise<void> {
  const { data: submitter } = await supabase
    .from('congress_submitters')
    .select('full_name, email')
    .eq('id', submitterId)
    .single();

  if (submitter) {
    await sendEmail(submitter.email, 'SUBMISSION_APPROVED', {
      name: submitter.full_name
    });
  }
}

export async function sendSubmissionRejection(submitterId: string): Promise<void> {
  const { data: submitter } = await supabase
    .from('congress_submitters')
    .select('full_name, email')
    .eq('id', submitterId)
    .single();

  if (submitter) {
    await sendEmail(submitter.email, 'SUBMISSION_REJECTED', {
      name: submitter.full_name
    });
  }
}

export async function sendMembershipApplication(
  memberId: string,
  membershipType: string
): Promise<void> {
  const { data: member } = await supabase
    .from('wahs_members')
    .select('full_name, email')
    .eq('id', memberId)
    .single();

  if (member) {
    await sendEmail(member.email, 'MEMBERSHIP_APPLICATION', {
      name: member.full_name,
      membershipType
    });
  }
}

export async function sendMembershipApproval(
  memberId: string,
  membershipType: string
): Promise<void> {
  const { data: member } = await supabase
    .from('wahs_members')
    .select('full_name, email')
    .eq('id', memberId)
    .single();

  if (member) {
    await sendEmail(member.email, 'MEMBERSHIP_APPROVED', {
      name: member.full_name,
      membershipType
    });
  }
}

export async function sendMembershipRejection(memberId: string): Promise<void> {
  const { data: member } = await supabase
    .from('wahs_members')
    .select('full_name, email')
    .eq('id', memberId)
    .single();

  if (member) {
    await sendEmail(member.email, 'MEMBERSHIP_REJECTED', {
      name: member.full_name
    });
  }
}

// Schedule reminder emails
export async function scheduleEarlyBirdReminder(): Promise<void> {
  // Get all submitters who haven't registered
  const { data: submitters } = await supabase
    .from('congress_submitters')
    .select('id, full_name, email')
    .eq('has_registered', false)
    .not('email', 'is', null);

  if (submitters) {
    for (const submitter of submitters) {
      // Send early bird reminder
      console.log(`Sending early bird reminder to ${submitter.email}`);
      // TODO: Implement actual email sending
    }
  }
}
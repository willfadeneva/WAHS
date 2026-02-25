import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'WAHS <noreply@iwahs.org>';

export async function sendMembershipConfirmation(to: string, name: string, type: string) {
  await resend.emails.send({
    from: FROM, to,
    subject: 'Welcome to WAHS — Membership Confirmed',
    html: `<p>Dear ${name},</p><p>Your <strong>${type}</strong> WAHS membership has been received and is being processed. You will receive a confirmation once activated.</p><p>Best regards,<br/>WAHS Team</p>`,
  });
}

export async function sendSubmissionConfirmation(to: string, name: string, title: string, year: number) {
  await resend.emails.send({
    from: FROM, to,
    subject: `Abstract Submission Received — Congress ${year}`,
    html: `<p>Dear ${name},</p><p>Your abstract "<strong>${title}</strong>" has been successfully submitted to Congress ${year}.</p><p>You can track its status in your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/congress/${year}/dashboard">submission dashboard</a>.</p><p>Best regards,<br/>WAHS Team</p>`,
  });
}

export async function sendSubmissionUpdate(to: string, name: string, title: string, status: string, year: number) {
  const statusLabels: Record<string, string> = {
    accepted: 'Accepted ✅',
    rejected: 'Not Accepted',
    under_review: 'Under Review',
    withdrawn: 'Withdrawn',
  };
  await resend.emails.send({
    from: FROM, to,
    subject: `Abstract Update — Congress ${year}`,
    html: `<p>Dear ${name},</p><p>Your abstract "<strong>${title}</strong>" status has been updated to: <strong>${statusLabels[status] || status}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/congress/${year}/dashboard">View your dashboard</a></p><p>Best regards,<br/>WAHS Team</p>`,
  });
}

export async function sendRegistrationConfirmation(to: string, name: string, year: number, ticketType: string, amount: string) {
  await resend.emails.send({
    from: FROM, to,
    subject: `Congress ${year} Registration Confirmed`,
    html: `<p>Dear ${name},</p><p>Your registration for Congress ${year} has been confirmed.</p><ul><li>Ticket type: <strong>${ticketType}</strong></li><li>Amount: <strong>${amount}</strong></li></ul><p><strong>Event Details:</strong><br/>Dates: May 28–30, 2026<br/>Venue: Cheju Halla University, Jeju Island, South Korea</p><p>Best regards,<br/>WAHS Team</p>`,
  });
}

export async function sendPasswordReset(to: string, link: string) {
  await resend.emails.send({
    from: FROM, to,
    subject: 'Reset Your WAHS Password',
    html: `<p>Click the link below to reset your password:</p><p><a href="${link}">Reset Password</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
  });
}

export async function sendAdminMagicLink(to: string, link: string) {
  await resend.emails.send({
    from: FROM, to,
    subject: 'WAHS Admin — Initialize Your Account',
    html: `<p>You have been added as a WAHS administrator.</p><p>Click the link below to set up your password and access the admin dashboard:</p><p><a href="${link}">Set Up Admin Account</a></p><p>This link expires in 24 hours.</p>`,
  });
}

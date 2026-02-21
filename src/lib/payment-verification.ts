import { supabase } from './supabase';

// PayPal payment statuses
type PayPalPaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

// Payment verification result
interface PaymentVerificationResult {
  verified: boolean;
  memberId?: string;
  error?: string;
  details?: any;
}

/**
 * Verify PayPal payment and update member status
 * This would be called by a PayPal webhook
 */
export async function verifyPayPalPayment(
  paymentId: string,
  payerEmail: string,
  amount: number,
  status: PayPalPaymentStatus,
  paymentDate: string
): Promise<PaymentVerificationResult> {
  try {
    console.log(`Verifying PayPal payment: ${paymentId} for ${payerEmail}`);
    
    // Find member by email
    const { data: memberData, error: memberError } = await supabase
      .from('wahs_members')
      .select('id, membership_type, membership_status, email')
      .eq('email', payerEmail.toLowerCase())
      .single();

    if (memberError || !memberData) {
      return {
        verified: false,
        error: `Member not found with email: ${payerEmail}`
      };
    }

    // Check if payment is completed
    if (status !== 'COMPLETED') {
      return {
        verified: false,
        memberId: memberData.id,
        error: `Payment status is ${status}, not COMPLETED`
      };
    }

    // Determine membership type based on amount (Professional: $250, Non-Professional: $150)
    let membershipType: 'professional' | 'non_professional';
    if (amount >= 250) {
      membershipType = 'professional';
    } else if (amount >= 150) {
      membershipType = 'non_professional';
    } else {
      return {
        verified: false,
        memberId: memberData.id,
        error: `Payment amount $${amount} is insufficient for any membership type`
      };
    }
    
    // Update member with payment info and auto-approve
    const { error: updateError } = await supabase
      .from('wahs_members')
      .update({
        payment_id: paymentId,
        payment_date: paymentDate,
        membership_type: membershipType,
        membership_status: 'active', // Auto-approve paid members
        approved_at: new Date().toISOString(),
        membership_expiry: calculateExpiryDate(), // 1 year from payment
        updated_at: new Date().toISOString()
      })
      .eq('id', memberData.id);

    if (updateError) {
      return {
        verified: false,
        memberId: memberData.id,
        error: `Failed to update member: ${updateError.message}`
      };
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(payerEmail, membershipType, paymentId);

    return {
      verified: true,
      memberId: memberData.id,
      details: {
        paymentId,
        membershipType,
        expiryDate: calculateExpiryDate()
      }
    };

  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      verified: false,
      error: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Calculate membership expiry date (1 year from now)
 */
function calculateExpiryDate(): string {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmationEmail(
  email: string,
  membershipType: string,
  paymentId: string
): Promise<void> {
  // This would integrate with your email service
  // For now, we'll log it
  console.log(`Payment confirmation email sent to ${email}`);
  console.log(`Membership: ${membershipType}, Payment ID: ${paymentId}`);
  
  // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
  // Example with Resend:
  /*
  await resend.emails.send({
    from: 'WAHS <noreply@wahs.org>',
    to: email,
    subject: 'WAHS Membership Payment Confirmed',
    html: `<h1>Payment Confirmed</h1>
           <p>Your ${membershipType} membership payment has been confirmed.</p>
           <p>Payment ID: ${paymentId}</p>
           <p>Your membership is now active for 1 year.</p>`
  });
  */
}

/**
 * Check if a member has paid (for admin dashboard)
 */
export async function checkMemberPaymentStatus(memberId: string): Promise<{
  hasPaid: boolean;
  paymentDate?: string;
  membershipType?: string;
  expiryDate?: string;
}> {
  const { data, error } = await supabase
    .from('wahs_members')
    .select('payment_id, payment_date, membership_type, membership_expiry')
    .eq('id', memberId)
    .single();

  if (error || !data) {
    return { hasPaid: false };
  }

  return {
    hasPaid: !!data.payment_id,
    paymentDate: data.payment_date,
    membershipType: data.membership_type,
    expiryDate: data.membership_expiry
  };
}

/**
 * Manual payment verification for admin dashboard
 */
export async function manuallyVerifyPayment(
  memberId: string,
  paymentId: string,
  paymentDate: string,
  membershipType: 'professional' | 'non_professional',
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('wahs_members')
      .update({
        payment_id: paymentId,
        payment_date: paymentDate,
        membership_type: membershipType,
        membership_status: 'active',
        approved_by: adminUserId,
        approved_at: new Date().toISOString(),
        membership_expiry: calculateExpiryDate(),
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Get member email to send confirmation
    const { data: memberData } = await supabase
      .from('wahs_members')
      .select('email')
      .eq('id', memberId)
      .single();

    if (memberData?.email) {
      await sendPaymentConfirmationEmail(memberData.email, membershipType, paymentId);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
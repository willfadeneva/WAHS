import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// PayPal IPN endpoint — receives payment notifications and auto-confirms records.
// Configure in PayPal Dashboard → Account Settings → Notifications → IPN:
//   https://congress.iwahs.org/api/webhooks/paypal-ipn
//
// Flow: PayPal POST → we POST back "cmd=_notify-validate" → PayPal replies "VERIFIED"
//       then we update the DB by payer_email + payment amount.

const PAYPAL_VERIFY_URL = process.env.PAYPAL_SANDBOX === 'true'
  ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
  : 'https://ipnpb.paypal.com/cgi-bin/webscr';

// Amount thresholds for payment type detection (±$5 tolerance)
const AMOUNTS = {
  wahsProfessional: 250,
  wahsStudent:      150,
  congressRegularEB: 240,
  congressRegularFull: 300,
  congressStudentEB: 120,
  congressStudentFull: 150,
};

function near(a: number, b: number) { return Math.abs(a - b) <= 5; }

export async function POST(request: NextRequest) {
  // 1. Read raw body for IPN verification
  const rawBody = await request.text();

  // 2. Verify with PayPal — must POST back with cmd=_notify-validate
  try {
    const verifyRes = await fetch(PAYPAL_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `cmd=_notify-validate&${rawBody}`,
    });
    const verifyText = await verifyRes.text();
    if (verifyText !== 'VERIFIED') {
      console.warn('[PayPal IPN] Not verified:', verifyText);
      return NextResponse.json({ ok: false, reason: 'not_verified' }, { status: 200 });
    }
  } catch (err) {
    console.error('[PayPal IPN] Verification error:', err);
    return NextResponse.json({ ok: false, reason: 'verify_error' }, { status: 200 });
  }

  // 3. Parse IPN params
  const params = new URLSearchParams(rawBody);
  const paymentStatus = params.get('payment_status');
  const payerEmail    = (params.get('payer_email') || '').toLowerCase();
  const txnId         = params.get('txn_id') || '';
  const amountStr     = params.get('mc_gross') || params.get('payment_gross') || '0';
  const amount        = parseFloat(amountStr);

  console.log(`[PayPal IPN] status=${paymentStatus} email=${payerEmail} amount=${amount} txn=${txnId}`);

  // Only process completed payments
  if (paymentStatus !== 'Completed') {
    return NextResponse.json({ ok: true, skipped: paymentStatus }, { status: 200 });
  }

  if (!payerEmail) {
    return NextResponse.json({ ok: false, reason: 'no_email' }, { status: 200 });
  }

  const supabase = createAdminClient();
  const now = new Date();

  // 4. Check for duplicate (already processed this txn_id)
  if (txnId) {
    const { data: existingMember } = await supabase
      .from('wahs_members')
      .select('id')
      .eq('paypal_transaction_id', txnId)
      .maybeSingle();
    const { data: existingReg } = await supabase
      .from('congress_registrations')
      .select('id')
      .eq('paypal_transaction_id', txnId)
      .maybeSingle();
    if (existingMember || existingReg) {
      return NextResponse.json({ ok: true, skipped: 'duplicate_txn' }, { status: 200 });
    }
  }

  // 5. Try to confirm WAHS membership first
  const isWahsMemberAmount = near(amount, AMOUNTS.wahsProfessional) || near(amount, AMOUNTS.wahsStudent);

  if (isWahsMemberAmount) {
    const { data: member } = await supabase
      .from('wahs_members')
      .select('id, membership_type')
      .eq('email', payerEmail)
      .eq('membership_status', 'pending')
      .order('joined_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (member) {
      const expiresAt = new Date(now);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error } = await supabase
        .from('wahs_members')
        .update({
          membership_status: 'active',
          paypal_transaction_id: txnId,
          expires_at: expiresAt.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', member.id);

      if (error) console.error('[PayPal IPN] Member update error:', error);
      else console.log(`[PayPal IPN] ✅ Membership activated for ${payerEmail}`);

      return NextResponse.json({ ok: true, action: 'membership_activated' }, { status: 200 });
    }
  }

  // 6. Try to confirm congress registration
  const isCongressAmount =
    near(amount, AMOUNTS.congressRegularEB) ||
    near(amount, AMOUNTS.congressRegularFull) ||
    near(amount, AMOUNTS.congressStudentEB) ||
    near(amount, AMOUNTS.congressStudentFull);

  if (isCongressAmount || !isWahsMemberAmount) {
    const { data: reg } = await supabase
      .from('congress_registrations')
      .select('id, ticket_type')
      .eq('email', payerEmail)
      .eq('amount_paid', 0)
      .not('ticket_type', 'eq', 'wahs_member')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (reg) {
      const { error } = await supabase
        .from('congress_registrations')
        .update({
          amount_paid: amount,
          paypal_transaction_id: txnId,
        })
        .eq('id', reg.id);

      if (error) console.error('[PayPal IPN] Registration update error:', error);
      else console.log(`[PayPal IPN] ✅ Congress registration confirmed for ${payerEmail} ($${amount})`);

      return NextResponse.json({ ok: true, action: 'registration_confirmed' }, { status: 200 });
    }
  }

  console.warn(`[PayPal IPN] No matching record for ${payerEmail} amount=${amount}`);
  return NextResponse.json({ ok: true, skipped: 'no_match' }, { status: 200 });
}

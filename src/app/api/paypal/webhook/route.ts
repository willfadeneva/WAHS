import { NextRequest, NextResponse } from 'next/server';
import { verifyPayPalPayment } from '@/lib/payment-verification';

// PayPal webhook secret (should be in environment variables)
const PAYPAL_WEBHOOK_SECRET = process.env.PAYPAL_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (simplified - in production use PayPal SDK)
    const signature = request.headers.get('paypal-transmission-id');
    const timestamp = request.headers.get('paypal-transmission-time');
    
    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing PayPal headers' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('PayPal webhook received:', JSON.stringify(body, null, 2));

    // Handle different webhook event types
    const eventType = body.event_type;
    
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const payment = body.resource;
      
      // Extract payment details
      const paymentId = payment.id;
      const payerEmail = payment.payer.email_address;
      const amount = parseFloat(payment.amount.value);
      const currency = payment.amount.currency_code;
      const status = payment.status;
      const paymentDate = payment.create_time;

      // Verify currency is USD
      if (currency !== 'USD') {
        console.warn(`Payment ${paymentId} is in ${currency}, not USD`);
        return NextResponse.json(
          { error: 'Invalid currency' },
          { status: 400 }
        );
      }

      // Verify payment
      const result = await verifyPayPalPayment(
        paymentId,
        payerEmail,
        amount,
        status,
        paymentDate
      );

      if (result.verified) {
        console.log(`Payment ${paymentId} verified successfully for member ${result.memberId}`);
        return NextResponse.json({
          success: true,
          message: 'Payment verified and member activated',
          memberId: result.memberId,
          details: result.details
        });
      } else {
        console.error(`Payment verification failed: ${result.error}`);
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
    }
    
    // Handle other event types
    else if (eventType === 'PAYMENT.CAPTURE.DENIED' || 
             eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      console.log(`Payment event: ${eventType}`, body.resource);
      return NextResponse.json({ 
        success: true, 
        message: `Event ${eventType} acknowledged` 
      });
    }
    
    else {
      console.log(`Unhandled PayPal event: ${eventType}`);
      return NextResponse.json({ 
        success: true, 
        message: `Event ${eventType} ignored` 
      });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For webhook verification (PayPal sends GET to verify)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'PayPal webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
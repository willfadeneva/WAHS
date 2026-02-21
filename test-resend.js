// Test Resend API key
const RESEND_API_KEY = 're_M3m1g1xH_BijKX8AEaNpY6F8v66v9P4WL';

async function testResend() {
  console.log('Testing Resend API key...');
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WAHS Test <onboarding@resend.dev>',
        to: ['charanjotsingh@gmail.com'],
        subject: 'Resend API Test',
        html: '<h1>Resend API Test</h1><p>If you receive this, Resend is working!</p>',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Resend API key is valid!');
      console.log('Response:', data);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Resend API error:', response.status, error);
      return false;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Also test Supabase connection
async function testSupabase() {
  console.log('\nTesting Supabase connection...');
  
  const SUPABASE_URL = 'https://gqroifralqsvrcuywfcr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxcm9pZnJhbHFzdnJjdXl3ZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzkwMTksImV4cCI6MjA1MzY1NTAxOX0.6b2UJj8wX9qX9ZJw8X9qX9ZJw8X9qX9ZJw8X9qX9ZJw';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection is working!');
      return true;
    } else {
      console.log('❌ Supabase error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Supabase network error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('=== Testing WAHS Configuration ===\n');
  
  const resendOk = await testResend();
  const supabaseOk = await testSupabase();
  
  console.log('\n=== Test Results ===');
  console.log(`Resend API: ${resendOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`Supabase: ${supabaseOk ? '✅ Working' : '❌ Failed'}`);
  
  if (resendOk && supabaseOk) {
    console.log('\n🎉 All systems ready! Emails will be sent via Resend.');
    console.log('Next steps:');
    console.log('1. Update from address to noreply@wahs.org in email-notifications.ts');
    console.log('2. Set up domain verification in Resend dashboard');
    console.log('3. Configure PayPal webhooks');
  } else {
    console.log('\n⚠️ Some systems need attention.');
  }
}

runTests();
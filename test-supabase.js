// Test Supabase connection with table query
const SUPABASE_URL = 'https://gqroifralqsvrcuywfcr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxcm9pZnJhbHFzdnJjdXl3ZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzkwMTksImV4cCI6MjA1MzY1NTAxOX0.6b2UJj8wX9qX9ZJw8X9qX9ZJw8X9qX9ZJw8X9qX9ZJw';

async function testSupabase() {
  console.log('Testing Supabase with table query...');
  
  try {
    // Try to query a table that should exist
    const response = await fetch(`${SUPABASE_URL}/rest/v1/congress_submitters?select=count`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Supabase query successful!');
      console.log('Data:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Supabase error response:', errorText);
      
      // Try a different approach - check if we can access the REST API root
      console.log('\nTrying REST API root...');
      const rootResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });
      console.log('Root response status:', rootResponse.status);
      
      return false;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Also check if the tables exist by running the migration
async function checkTables() {
  console.log('\nChecking if tables exist...');
  
  // List of tables that should exist after migration
  const tables = [
    'congress_submitters',
    'submissions',
    'wahs_members',
    'admin_users',
    'magic_link_tokens',
    'email_logs'
  ];
  
  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });
      
      if (response.status === 200) {
        console.log(`✅ Table ${table} exists`);
      } else if (response.status === 404) {
        console.log(`❌ Table ${table} does not exist (404)`);
      } else {
        console.log(`⚠️ Table ${table}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error checking ${table}:`, error.message);
    }
  }
}

async function runTests() {
  console.log('=== Supabase Connection Test ===\n');
  
  const supabaseOk = await testSupabase();
  
  if (supabaseOk) {
    await checkTables();
  } else {
    console.log('\n⚠️ Supabase connection failed. Possible issues:');
    console.log('1. API key expired or invalid');
    console.log('2. Project suspended or deleted');
    console.log('3. Network restrictions');
    console.log('\nCheck Supabase dashboard: https://supabase.com/dashboard/project/gqroifralqsvrcuywfcr');
  }
}

runTests();
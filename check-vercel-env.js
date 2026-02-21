// Check what environment variables might be set in Vercel
console.log('Checking environment configuration...\n');

// These would be set in Vercel environment variables
const envVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'NODE_ENV'
];

console.log('Expected environment variables:');
envVars.forEach(varName => {
  console.log(`- ${varName}: ${process.env[varName] ? 'SET' : 'NOT SET'}`);
});

console.log('\nNote: Environment variables in Vercel:');
console.log('1. Go to https://vercel.com/willfadeneva/WAHS/settings/environment-variables');
console.log('2. Check what values are set');
console.log('3. Update if needed');

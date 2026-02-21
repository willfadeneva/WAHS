#!/bin/bash
echo "Testing WAHS Authentication System Setup"
echo "========================================"

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local found"
    
    # Check for required environment variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Supabase environment variables found"
    else
        echo "❌ Missing Supabase environment variables"
    fi
else
    echo "❌ .env.local not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ node_modules found"
else
    echo "⚠️  node_modules not found - run 'npm install'"
fi

# Check if pages exist
echo ""
echo "Checking page files:"

pages=(
    "src/app/congress/register/page.tsx"
    "src/app/congress/login/page.tsx"
    "src/app/congress/dashboard/page.tsx"
    "src/app/wahs/register/page.tsx"
    "src/app/wahs/login/page.tsx"
    "src/app/wahs/dashboard/page.tsx"
    "src/app/admin/page.tsx"
    "src/app/auth/callback/route.ts"
    "src/contexts/AuthContext.tsx"
    "src/components/SubmissionFormAuth.tsx"
)

missing=0
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page"
    else
        echo "❌ $page (missing)"
        missing=$((missing + 1))
    fi
done

echo ""
echo "Summary:"
if [ $missing -eq 0 ]; then
    echo "✅ All files present"
else
    echo "⚠️  $missing files missing"
fi

echo ""
echo "Next steps:"
echo "1. Run the SQL in AUTH_SETUP.md in Supabase SQL Editor"
echo "2. Create storage buckets in Supabase: 'abstracts' and 'member-photos'"
echo "3. Configure Supabase Auth with magic links"
echo "4. Run 'npm run dev' to test locally"
echo "5. Update navigation links to point to new auth pages"

echo ""
echo "Test URLs (when running locally):"
echo "- Congress Register: http://localhost:3000/congress/register"
echo "- Congress Login: http://localhost:3000/congress/login"
echo "- WAHS Register: http://localhost:3000/wahs/register"
echo "- WAHS Login: http://localhost:3000/wahs/login"
echo "- Admin: http://localhost:3000/admin"
echo "- Congress Dashboard: http://localhost:3000/congress/dashboard"
echo "- WAHS Dashboard: http://localhost:3000/wahs/dashboard"
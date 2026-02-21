#!/usr/bin/env python3
"""
Run SQL migration on Supabase
"""
import os
import requests
import json
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent / '.env.local'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '').replace('https://', '')
SUPABASE_PROJECT_ID = SUPABASE_URL.split('.')[0] if SUPABASE_URL else ''
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

if not SERVICE_ROLE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local")
    exit(1)

# Read SQL migration
migration_path = Path(__file__).parent / 'supabase/migrations/202602210200_auth_system.sql'
with open(migration_path) as f:
    sql = f.read()

# Execute via Supabase REST API
url = f"https://{SUPABASE_URL}/rest/v1/rpc/exec_sql"
headers = {
    'Authorization': f'Bearer {SERVICE_ROLE_KEY}',
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY
}
data = {
    'query': sql
}

print(f"Running migration on project: {SUPABASE_PROJECT_ID}")
print("SQL to execute (first 500 chars):")
print(sql[:500] + "..." if len(sql) > 500 else sql)
print("\n" + "="*50)

try:
    response = requests.post(url, headers=headers, json=data, timeout=30)
    if response.status_code == 200:
        print("✅ Migration executed successfully!")
        print("Response:", response.text[:200])
    else:
        print(f"❌ Migration failed with status {response.status_code}")
        print("Response:", response.text)
except Exception as e:
    print(f"❌ Error executing migration: {e}")
    print("\nManual steps:")
    print("1. Go to https://supabase.com/dashboard/project/" + SUPABASE_PROJECT_ID)
    print("2. Click 'SQL Editor' in left sidebar")
    print("3. Copy and paste the SQL from:")
    print(f"   {migration_path}")
    print("4. Run the SQL")
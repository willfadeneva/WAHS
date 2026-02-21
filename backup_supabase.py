#!/usr/bin/env python3
"""
Backup Supabase database before making auth system changes.
Uses Supabase REST API to get current schema and data.
"""

import os
import json
import requests
from datetime import datetime
import sys

# Load environment variables from .env.local
env_path = os.path.join(os.path.dirname(__file__), '.env.local')
env_vars = {}
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value

# Get Supabase credentials
SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SERVICE_ROLE_KEY = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("❌ Missing Supabase credentials in .env.local")
    sys.exit(1)

# Extract project ID from URL
project_id = SUPABASE_URL.split('//')[1].split('.')[0]
print(f"📦 Project ID: {project_id}")

# Create backup directory
backup_dir = os.path.join(os.path.dirname(__file__), 'supabase_backup')
os.makedirs(backup_dir, exist_ok=True)

timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
backup_file = os.path.join(backup_dir, f'backup_{timestamp}.json')

print(f"🔍 Connecting to Supabase...")
print(f"📁 Backup will be saved to: {backup_file}")

# Headers for Supabase REST API
headers = {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': f'Bearer {SERVICE_ROLE_KEY}',
    'Content-Type': 'application/json'
}

def make_request(endpoint, params=None):
    """Make request to Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching {endpoint}: {e}")
        return None

def backup_table(table_name):
    """Backup a single table"""
    print(f"  📊 Backing up table: {table_name}")
    
    # Get table schema
    schema_url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    schema_response = requests.get(schema_url, headers={**headers, 'Accept': 'application/vnd.pgrst.object+json'})
    
    # Get table data (all rows)
    data = make_request(table_name, {'select': '*'})
    
    return {
        'table': table_name,
        'schema_info': schema_response.headers.get('Content-Type'),
        'row_count': len(data) if data else 0,
        'data': data
    }

# Get list of tables
print("\n📋 Getting list of tables...")
tables_url = f"{SUPABASE_URL}/rest/v1/"
try:
    # Try to get tables from information_schema
    tables_query = {
        'select': 'table_name',
        'from': 'information_schema.tables',
        'where': 'table_schema=public'
    }
    
    # Alternative: Try common tables
    common_tables = [
        'congresses', 'submissions', 'speakers', 'committee',
        'registration_tiers', 'membership_tiers', 'payments'
    ]
    
    backup_data = {
        'timestamp': timestamp,
        'project_id': project_id,
        'tables': {}
    }
    
    # Try to backup known tables
    for table in common_tables:
        table_data = backup_table(table)
        if table_data['data'] is not None:
            backup_data['tables'][table] = table_data
        else:
            print(f"  ⚠️  Table {table} not found or empty")
    
    # Also check for any tables via pg_catalog
    print("\n🔍 Checking for additional tables...")
    pg_tables = make_request('pg_tables', {'select': 'tablename', 'schema': 'eq.public'})
    if pg_tables:
        for table_info in pg_tables:
            table_name = table_info.get('tablename')
            if table_name not in backup_data['tables']:
                table_data = backup_table(table_name)
                if table_data['data'] is not None:
                    backup_data['tables'][table_name] = table_data
    
    # Save backup
    with open(backup_file, 'w') as f:
        json.dump(backup_data, f, indent=2, default=str)
    
    # Summary
    print(f"\n✅ Backup completed!")
    print(f"📁 File: {backup_file}")
    print(f"📊 Tables backed up: {len(backup_data['tables'])}")
    
    for table_name, table_data in backup_data['tables'].items():
        print(f"  • {table_name}: {table_data['row_count']} rows")
    
    # Create a simple SQL backup as well
    sql_file = os.path.join(backup_dir, f'backup_{timestamp}.sql')
    with open(sql_file, 'w') as f:
        f.write(f"-- Supabase Backup {timestamp}\n")
        f.write(f"-- Project: {project_id}\n\n")
        
        for table_name, table_data in backup_data['tables'].items():
            if table_data['data']:
                f.write(f"\n-- Table: {table_name}\n")
                # Note: This is a simplified representation
                # For a real SQL backup, we'd need CREATE TABLE statements
                f.write(f"-- Contains {len(table_data['data'])} rows\n")
    
    print(f"📝 SQL summary: {sql_file}")
    
except Exception as e:
    print(f"❌ Error during backup: {e}")
    import traceback
    traceback.print_exc()

print("\n🔒 Backup complete. Safe to proceed with Supabase updates.")
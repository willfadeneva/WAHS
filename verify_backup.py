#!/usr/bin/env python3
"""
Verify the Supabase backup integrity.
"""

import json
import os
import sys

def verify_backup(backup_file):
    """Verify backup file integrity"""
    print(f"🔍 Verifying backup: {backup_file}")
    
    try:
        with open(backup_file, 'r') as f:
            data = json.load(f)
        
        # Check required fields
        required_fields = ['timestamp', 'project_id', 'tables']
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing field: {field}")
                return False
        
        print(f"✅ Backup metadata:")
        print(f"   • Timestamp: {data['timestamp']}")
        print(f"   • Project ID: {data['project_id']}")
        print(f"   • Tables: {len(data['tables'])}")
        
        # Check each table
        total_rows = 0
        for table_name, table_data in data['tables'].items():
            print(f"\n📊 Table: {table_name}")
            print(f"   • Rows: {table_data.get('row_count', 0)}")
            
            if 'data' in table_data and table_data['data']:
                # Check first row structure
                first_row = table_data['data'][0]
                print(f"   • Columns: {len(first_row) if isinstance(first_row, dict) else 'N/A'}")
                
                if table_name == 'congresses':
                    # Verify congress data
                    if 'year' in first_row and first_row['year'] == 2026:
                        print(f"   • ✅ Congress 2026 data verified")
                    else:
                        print(f"   • ⚠️  Congress data mismatch")
                
                total_rows += table_data['row_count']
            else:
                print(f"   • ⚠️  No data or empty table")
        
        print(f"\n📈 Summary:")
        print(f"   • Total tables: {len(data['tables'])}")
        print(f"   • Total rows: {total_rows}")
        print(f"   • Backup size: {os.path.getsize(backup_file) / 1024:.1f} KB")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False

def main():
    # Find latest backup
    backup_dir = 'supabase_backup'
    if not os.path.exists(backup_dir):
        print(f"❌ Backup directory not found: {backup_dir}")
        return
    
    backup_files = [f for f in os.listdir(backup_dir) if f.endswith('.json')]
    if not backup_files:
        print(f"❌ No backup files found in {backup_dir}")
        return
    
    # Use latest backup
    latest_backup = sorted(backup_files)[-1]
    backup_path = os.path.join(backup_dir, latest_backup)
    
    print("=" * 50)
    print("SUPABASE BACKUP VERIFICATION")
    print("=" * 50)
    
    if verify_backup(backup_path):
        print("\n✅ Backup verification PASSED")
        print("\n📋 Next steps:")
        print("1. Create Supabase dashboard backup (recommended)")
        print("2. Run migration SQL in Supabase SQL Editor")
        print("3. Test authentication system")
        print("4. Monitor for any issues")
    else:
        print("\n❌ Backup verification FAILED")
        print("Do not proceed until backup is verified!")
    
    print("\n🔒 Backup location:", backup_path)

if __name__ == '__main__':
    main()
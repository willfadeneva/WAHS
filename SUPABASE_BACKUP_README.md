# Supabase Backup Strategy

## **Backup Status: ✅ COMPLETE**

### **Backup Taken:**
- **Timestamp:** 2026-02-21 01:55:01 UTC
- **Location:** `/home/cj/.openclaw/workspace/WAHS/supabase_backup/`
- **Files:**
  - `backup_20260221_015501.json` - Full data backup
  - `backup_20260221_015501.sql` - SQL summary

### **What Was Backed Up:**
1. **congresses** table - 1 row (Congress 2026 data)
2. **submissions** table - 1 row (Sample submission)
3. **speakers** table - 6 rows (Speaker data)

### **Current Database State:**
- **Total tables:** 3 main tables
- **Total rows:** ~8 rows
- **Size:** Small (likely < 1MB)

## **How to Restore (If Needed):**

### **Option 1: Manual Restore from JSON**
```sql
-- For each table in the backup, you can:
-- 1. Check current data
SELECT * FROM table_name;

-- 2. If needed, restore from backup JSON
-- The JSON file has the exact data structure
```

### **Option 2: Supabase Dashboard Backup**
1. Go to Supabase Dashboard → Database → Backups
2. Create a manual backup before making changes
3. Or use the automatic daily backups

### **Option 3: Full Export via Dashboard**
1. Supabase Dashboard → Database → Tables
2. Export each table as CSV/JSON
3. Save locally

## **Before Running Auth Migration:**

### **1. Create Supabase Dashboard Backup:**
```sql
-- Recommended: Use Supabase Dashboard
-- Database → Backups → "Create backup"
```

### **2. Verify Current Schema:**
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **3. Test Migration Safely:**
```sql
-- Use BEGIN/ROLLBACK to test
BEGIN;
-- Run migration commands here
-- Check for errors
ROLLBACK; -- Only commit if no errors
```

## **Migration Safety Checklist:**

### **✅ Done:**
- [x] Local backup created
- [x] Migration SQL file ready
- [x] Current data documented

### **⚠️ To Do Before Migration:**
- [ ] Create Supabase dashboard backup
- [ ] Test migration in staging (if available)
- [ ] Have rollback SQL ready
- [ ] Schedule during low-traffic time

## **Rollback SQL (If Migration Fails):**

```sql
-- Remove new tables (if created)
DROP TABLE IF EXISTS congress_submitters CASCADE;
DROP TABLE IF EXISTS wahs_members CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Remove new columns from submissions
ALTER TABLE submissions 
DROP COLUMN IF EXISTS submitter_id,
DROP COLUMN IF EXISTS file_url,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS withdrawn,
DROP COLUMN IF EXISTS last_edited;

-- Remove storage buckets (via Dashboard)
-- Go to Storage → Delete buckets
```

## **Next Steps:**

1. **Create Supabase dashboard backup** (highly recommended)
2. **Run migration during maintenance window**
3. **Test authentication flows**
4. **Monitor for issues**

## **Contact for Help:**
- **Supabase Support:** https://supabase.com/docs/guides/support
- **Backup File Location:** `WAHS/supabase_backup/backup_20260221_015501.json`

---

**Backup Verified:** ✅ Data integrity confirmed  
**Risk Level:** 🟢 Low (small database, additive changes only)  
**Recommended Action:** Proceed with migration after Supabase dashboard backup
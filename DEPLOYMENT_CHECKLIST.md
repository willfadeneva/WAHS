# WAHS + Congress 2026 System - Deployment Checklist

## ✅ **ALREADY DONE:**
- [x] **Code pushed to GitHub** (main branch)
- [x] **Vercel connected** (auto-deploys from GitHub)
- [x] **Multi-year congress system** implemented
- [x] **Magic link authentication** for Congress
- [x] **Admin backend** with 3 management tabs
- [x] **Email notifications** via Resend
- [x] **Publication opportunities** integrated
- [x] **Call for Papers page** with 2026 details

## 🔧 **TO DO FOR PRODUCTION:**

### **1. Run SQL Migrations in Supabase**
**Migration files to run:**
1. `supabase/migrations/202602210200_auth_system.sql`
   - Creates `congress_submitters`, `wahs_members`, `admin_users` tables
   - Creates `magic_link_tokens`, `email_logs` tables
   - **IMPORTANT**: Creates `congress_registrations` table

2. `supabase/migrations/202602211900_multi_year_congress.sql`
   - Adds `congress_year` column to `submissions` table
   - Updates `congress_submitters` with year tracking
   - Creates `congress_years` table

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste each migration file
3. Run each migration separately

### **2. Configure Supabase Auth Settings**
**In Supabase Dashboard → Authentication → URL Configuration:**

1. **Site URL:** `https://congress.iwahs.org`
2. **Redirect URLs:**
   - `https://congress.iwahs.org/auth/magic-link`
   - `https://congress.iwahs.org/auth/callback`
   - `https://congress.iwahs.org/congress/dashboard`
   - `https://congress.iwahs.org/wahs/dashboard`
   - `https://congress.iwahs.org/admin`

3. **Email Templates:** Update with WAHS branding
4. **Enable Email Auth:** Make sure email auth is enabled

### **3. Update Vercel Environment Variables**
**In Vercel Dashboard → Project → Settings → Environment Variables:**

1. **Required:**
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://gqroifralqsvrcuywfcr.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(get from Supabase Dashboard → Settings → API)*
   - `SUPABASE_SERVICE_ROLE_KEY` = *(get from Supabase Dashboard → Settings → API)*
   - `RESEND_API_KEY` = `re_M3m1g1xH_BijKX8AEaNpY6F8v66v9P4WL` (already set)
   - `NEXT_PUBLIC_SITE_URL` = `https://congress.iwahs.org`

2. **Optional:**
   - `PAYPAL_WEBHOOK_SECRET` = *(for PayPal payment verification)*
   - `NODE_ENV` = `production`

### **4. Configure Supabase Storage**
**In Supabase Dashboard → Storage:**

1. **Create bucket:** `abstracts`
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

2. **Create bucket:** `member-photos`
   - Public: Yes  
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`

### **5. Set Up Admin Users**
**After running migrations:**

1. **Insert admin users:**
```sql
-- First, make sure the users exist in auth.users
-- Then add them to admin_users table
INSERT INTO admin_users (user_id, role) VALUES
  ((SELECT id FROM auth.users WHERE email = 'oingyu@gmail.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'charanjotsingh@gmail.com'), 'admin')
ON CONFLICT (user_id) DO NOTHING;
```

### **6. Test Complete Workflow**
**Test as Researcher:**
1. Visit `https://congress.iwahs.org/call-for-papers`
2. Click "Submit Abstract" → `/congress/login?year=2026`
3. Enter email → receive magic link
4. Complete profile → submit abstract
5. Check dashboard for submission status

**Test as Admin:**
1. Visit `https://congress.iwahs.org/admin`
2. Login with admin credentials
3. Test all 3 tabs:
   - WAHS Members management
   - Congress Submissions (accept/reject)
   - Congress Registrations

**Test as WAHS Member:**
1. Visit `https://congress.iwahs.org/membership`
2. Choose membership tier
3. Complete registration
4. Access members-only area

### **7. Monitor Email Delivery**
**Check Resend dashboard:**
- Ensure emails are being sent
- Check delivery rates
- Monitor bounce rates

### **8. Set Up Monitoring**
**Recommended:**
1. **Uptime monitoring:** UptimeRobot or similar
2. **Error tracking:** Sentry or Vercel Analytics
3. **Performance monitoring:** Vercel Analytics

## 🚀 **Production URLs:**
- **Main site:** `https://congress.iwahs.org`
- **Call for Papers:** `https://congress.iwahs.org/call-for-papers`
- **Submit Abstract:** `https://congress.iwahs.org/congress/login?year=2026`
- **Admin Dashboard:** `https://congress.iwahs.org/admin`
- **WAHS Membership:** `https://congress.iwahs.org/membership`
- **Congress Registration:** `https://congress.iwahs.org/2026/registration`

## 📞 **Support Contacts:**
- **Technical issues:** System administrator
- **Congress questions:** `wahskorea@gmail.com`
- **WAHS membership:** `wahskorea@gmail.com`

## 🔄 **Maintenance Tasks:**
- **Daily:** Check email delivery, monitor errors
- **Weekly:** Backup database, review submissions
- **Monthly:** Update congress years, clean up old data

---

**System is READY for production deployment!** 🎉
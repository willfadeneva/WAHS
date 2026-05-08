# WAHS — Project Reference
Auto-generated: do not edit — updated by Hermes Agent

**Description:** World Association for Hallyu Studies — Next.js + Supabase + Vercel

- **Live URL:** [https://www.iwahs.org](https://www.iwahs.org)
- **Git:** https://github.com/willfadeneva/WAHS.git
- **NPM package:** wahs-2026
- **Vercel:** Vercel linked to GitHub (willfadeneva/WAHS → iwahs.org via Vercel DNS)
- **Deploy:** Auto-deploy from GitHub push

## Environment Variables
  - SUPABASE_URL (needs to be set in Vercel env — currently causing build failures)
  - SUPABASE_ANON_KEY (needs to be set in Vercel env)
  - NEXT_PUBLIC_SUPABASE_URL (local .env)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (local .env)

## Notes
- Board members: data in BOTH `Committee.tsx` (homepage) AND `board-members/page.tsx` (congress page)
- Author: Dev <dev@iwahs.org>
- Domain iwahs.org → CNAME to Vercel DNS
- Local ~/projects/wahs dir is empty — only the GitHub clone has code

# WAHS 2026 — 12th World Congress for Hallyu Studies

**Cultural Dynamism in the Digital Age — Toward a Universal Theory of Pop Culture Globalization**

🌐 **Live:** [congress.iwahs.org/2026](https://congress.iwahs.org/2026)

## About

Official website for the 12th World Congress for Hallyu Studies, hosted by the World Association for Hallyu Studies (WAHS) at Jeju Island, South Korea — May 28–30, 2026.

## Stack

- **Next.js 14** — App Router, ISR
- **Supabase** — Postgres, Auth, RLS
- **Vercel** — Hosting, auto-deploy from `main`

## Features

- Speaker profiles & special plenary section
- Abstract submission portal
- Registration with PayPal payments (early bird auto-pricing)
- Admin panel (restricted access)
- Multi-year URL routing (`/2026`, `/2027`, etc.)
- Responsive design with scroll animations

## Development

```bash
npm install
cp .env.local.example .env.local  # Add Supabase credentials
npm run dev
```

## Deployment

Pushes to `main` auto-deploy to Vercel. Do not trigger manual deploys.

## License

All rights reserved — World Association for Hallyu Studies.

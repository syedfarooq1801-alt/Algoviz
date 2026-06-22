# AlgoViz Admin

Standalone, private admin dashboard. **Separate deployment from the public web/mobile apps** — the public site does not ship this code or any `/admin` route.

## Access control (two layers)

1. **Email allowlist** — only emails in [`lib/admin.ts`](lib/admin.ts) see the dashboard. Anyone else gets "Access denied".
2. **Firestore rules** — `users/{uid}` (which holds email + full progress) is **readable only by the owner or an admin**. Other signed-in users cannot query it. The leaderboard and public profiles read a separate `leaderboard/{uid}` projection that contains no email. So emails are genuinely private at the data layer, not just hidden in the UI. See `dsa-platform/firestore.rules`.

## Local dev

```bash
cp .env.example .env.local   # fill in Firebase config
npm install
npm run dev                  # http://localhost:3100
```

## Deploy (separate Vercel project)

1. New Vercel project → import the same `Algoviz` repo.
2. **Root Directory = `admin-dashboard`**.
3. Add the 6 `NEXT_PUBLIC_FIREBASE_*` env vars.
4. Deploy. Use the resulting URL privately (it is `noindex`, won't appear in search).

Add your Vercel admin domain to **Firebase Console → Authentication → Settings → Authorized domains** so Google sign-in works.

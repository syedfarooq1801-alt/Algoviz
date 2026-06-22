# AlgoViz Admin

Standalone, private admin dashboard. **Separate deployment from the public web/mobile apps** — the public site does not ship this code or any `/admin` route.

## Access control (two layers)

1. **Email allowlist** — only emails in [`lib/admin.ts`](lib/admin.ts) see the dashboard. Anyone else gets "Access denied".
2. **Firestore rules** — writes to `users/{uid}` are admin-or-owner only (see `dsa-platform/firestore.rules`).

> Note: the dashboard reads the `users` collection, which (for the leaderboard) is readable by any signed-in user. The email gate hides the UI; it is not a data wall. If you want user emails fully private, split a public projection collection (xp/streak/name only) for the leaderboard and lock `users` reads to admin. Ask and this can be wired.

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

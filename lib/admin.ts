// Admin allowlist — emails with access to /admin dashboard.
// To add admins, append their email here (and keep Firestore rules in sync if you lock reads down).
export const ADMIN_EMAILS = [
  "syedfarooq1095@gmail.com",
];

export function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

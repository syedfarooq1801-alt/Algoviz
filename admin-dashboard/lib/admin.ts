// Admin allowlist — only these emails can view the dashboard.
// Keep in sync with the Firestore security rules (firestore.rules in the web project).
export const ADMIN_EMAILS = [
  "syedfarooq1095@gmail.com",
];

export function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

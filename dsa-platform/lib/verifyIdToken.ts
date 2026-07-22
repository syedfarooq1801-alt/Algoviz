// Server-only. Verifies a Firebase ID token via the Identity Toolkit REST API
// using the existing public Web API key — no firebase-admin / service-account
// setup needed. Used to gate the paid AI routes (chat, behavioral-feedback)
// so an anonymous caller can't hit them directly and burn the Groq budget.
export async function verifyIdToken(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization") ?? "";
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!idToken) return null;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const uid = data?.users?.[0]?.localId;
    return typeof uid === "string" ? uid : null;
  } catch {
    return null;
  }
}

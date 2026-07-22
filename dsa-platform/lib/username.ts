import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";

// 3–20 chars: letters, numbers, underscore. Case preserved for display, matched lowercase.
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function validateUsername(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 3) return "At least 3 characters.";
  if (trimmed.length > 20) return "At most 20 characters.";
  if (!USERNAME_RE.test(trimmed)) return "Only letters, numbers, and underscore.";
  return null;
}

// True if the handle is free, or already owned by this user.
export async function isUsernameAvailable(name: string, myUid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "usernames", name.trim().toLowerCase()));
  return !snap.exists() || snap.data().uid === myUid;
}

// Atomically reserve `newName`, write it onto the user doc, and release `oldName`.
// Throws "Username already taken." if another user holds it.
export async function claimUsername(uid: string, newName: string, oldName?: string): Promise<void> {
  const display = newName.trim();
  const lower = display.toLowerCase();
  // Callers already validate before calling, but the actual Firestore write
  // happens here — this is the one place that must not trust the caller, so
  // it re-checks rather than relying on validation staying correct upstream.
  const validationError = validateUsername(display);
  if (validationError) throw new Error(validationError);
  await runTransaction(db, async (tx) => {
    const newRef = doc(db, "usernames", lower);
    const newSnap = await tx.get(newRef);
    if (newSnap.exists() && newSnap.data().uid !== uid) {
      throw new Error("Username already taken.");
    }
    tx.set(newRef, { uid });
    tx.set(doc(db, "users", uid), { username: display }, { merge: true });
    tx.set(doc(db, "leaderboard", uid), { username: display }, { merge: true }); // public projection
    if (oldName && oldName.trim().toLowerCase() !== lower) {
      tx.delete(doc(db, "usernames", oldName.trim().toLowerCase()));
    }
  });
}

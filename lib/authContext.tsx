"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { useProgressStore } from "./store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInError: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInError: null,
  signIn: async () => {},
  signOut: async () => {},
});

async function saveNewUser(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: u.displayName,
      email: u.email,
      photoURL: u.photoURL,
      solved: [],
      bookmarked: [],
      xp: 0,
      streak: 0,
      lastActivity: "",
      createdAt: new Date().toISOString(),
    });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result on page load
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) await saveNewUser(result.user);
    }).catch(() => {});

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadUserData(u.uid);
      else useProgressStore.getState().resetForUser();
      setLoading(false);
    });
    return unsub;
  }, []);

  const loadUserData = async (uid: string) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      useProgressStore.getState().hydrateFromFirestore({
        solved: new Set<string>(data.solved ?? []),
        bookmarked: new Set<string>(data.bookmarked ?? []),
        xp: data.xp ?? 0,
        streak: data.streak ?? 0,
        lastActivity: data.lastActivity ?? "",
      });
    }
  };

  const signIn = async () => {
    setSignInError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveNewUser(result.user);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user") {
        // Fall back to redirect flow
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr: unknown) {
          const re = redirectErr as { message?: string };
          setSignInError(re.message ?? "Sign-in failed. Please try again.");
        }
      } else if (e.code === "auth/unauthorized-domain") {
        setSignInError(
          "Sign-in blocked: this domain isn't authorized in Firebase. Add it in Firebase Console → Authentication → Settings → Authorized domains."
        );
      } else {
        setSignInError(e.message ?? "Sign-in failed. Please try again.");
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    useProgressStore.getState().resetForUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export async function syncToFirestore(uid: string) {
  const { solved, bookmarked, xp, streak, lastActivity } = useProgressStore.getState();
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    solved: Array.from(solved),
    bookmarked: Array.from(bookmarked),
    xp,
    streak,
    lastActivity,
  });
}

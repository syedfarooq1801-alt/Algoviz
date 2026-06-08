"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { useProgressStore } from "./store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadUserData(u.uid);
      } else {
        useProgressStore.getState().resetForUser();
      }
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
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
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
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    useProgressStore.getState().resetForUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Sync helper — call after every store mutation when logged in
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

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  User, signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut as firebaseSignOut, onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { useProgressStore } from "./store";
import { useSDStore } from "./sdStore";
import { useSEStore } from "./seStore";
import { useFlashcardStore } from "./flashcardStore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInError: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, signInError: null,
  signIn: async () => {}, signOut: async () => {},
});

async function saveNewUser(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: u.displayName, email: u.email, photoURL: u.photoURL,
      solved: [], bookmarked: [], xp: 0, streak: 0, lastActivity: "", studyPlanDuration: 30,
      sdMastered: [], sdBookmarked: [],
      seCompleted: [],
      flashcardKnown: [], flashcardWeak: [],
      createdAt: new Date().toISOString(),
    });
  }
}

async function loadUserData(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const d = snap.data();

  useProgressStore.getState().hydrateFromFirestore({
    solved: new Set<string>(d.solved ?? []),
    bookmarked: new Set<string>(d.bookmarked ?? []),
    xp: d.xp ?? 0,
    streak: d.streak ?? 0,
    lastActivity: d.lastActivity ?? "",
    studyPlanDuration: ([30, 60, 90].includes(d.studyPlanDuration) ? d.studyPlanDuration : 30) as 30 | 60 | 90,
  });
  useSDStore.getState().hydrateFromFirestore({
    mastered: new Set<string>(d.sdMastered ?? []),
    bookmarked: new Set<string>(d.sdBookmarked ?? []),
  });
  useSEStore.getState().hydrateFromFirestore({
    completed: new Set<string>(d.seCompleted ?? []),
  });
  useFlashcardStore.getState().hydrateFromFirestore({
    known: new Set<string>(d.flashcardKnown ?? []),
    weak: new Set<string>(d.flashcardWeak ?? []),
    nextReview: d.flashcardNextReview ?? {},
    level: d.flashcardLevel ?? {},
  });
}

async function syncAllToFirestore(uid: string) {
  const { solved, bookmarked, xp, streak, lastActivity, studyPlanDuration } = useProgressStore.getState();
  const { mastered: sdMastered, bookmarked: sdBookmarked } = useSDStore.getState();
  const { completed: seCompleted } = useSEStore.getState();
  const { known: flashcardKnown, weak: flashcardWeak, nextReview: flashcardNextReview, level: flashcardLevel } = useFlashcardStore.getState();

  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    solved: Array.from(solved),
    bookmarked: Array.from(bookmarked),
    xp, streak, lastActivity, studyPlanDuration,
    sdMastered: Array.from(sdMastered),
    sdBookmarked: Array.from(sdBookmarked),
    seCompleted: Array.from(seCompleted),
    flashcardKnown: Array.from(flashcardKnown),
    flashcardWeak: Array.from(flashcardWeak),
    flashcardNextReview,
    flashcardLevel,
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
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

  // Auto-sync all stores to Firestore whenever any store changes (debounced 1.5s)
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    let timer: ReturnType<typeof setTimeout>;

    const syncDebounced = () => {
      clearTimeout(timer);
      timer = setTimeout(() => syncAllToFirestore(uid).catch(console.error), 1500);
    };

    const u1 = useProgressStore.subscribe(syncDebounced);
    const u2 = useSDStore.subscribe(syncDebounced);
    const u3 = useSEStore.subscribe(syncDebounced);
    const u4 = useFlashcardStore.subscribe(syncDebounced);

    return () => { u1(); u2(); u3(); u4(); clearTimeout(timer); };
  }, [user]);

  const signIn = async () => {
    setSignInError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveNewUser(result.user);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user") {
        try { await signInWithRedirect(auth, googleProvider); }
        catch (re: unknown) {
          const r = re as { message?: string };
          setSignInError(r.message ?? "Sign-in failed. Please try again.");
        }
      } else if (e.code === "auth/unauthorized-domain") {
        setSignInError("Sign-in blocked: domain not authorized in Firebase Console → Authentication → Authorized domains.");
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

// Keep named export for any direct callers
export { syncAllToFirestore as syncToFirestore };

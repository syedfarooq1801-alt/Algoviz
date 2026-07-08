"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  User, signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut as firebaseSignOut, onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { logError } from "./logger";
import { auth, db, googleProvider } from "./firebase";
import { useProgressStore } from "./store";
import { useSDStore } from "./sdStore";
import { useSEStore } from "./seStore";
import { useLLDStore } from "./lldStore";
import { useFlashcardStore } from "./flashcardStore";
import { usePrepStore } from "./prepStore";

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

// Track when we last wrote to Firestore — prevents bouncing our own writes back
let lastLocalWriteAt = 0;
let unsubSnapshot: (() => void) | null = null;

async function saveNewUser(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  const createdAt = new Date().toISOString();
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: u.displayName, email: u.email, photoURL: u.photoURL,
      solved: [], bookmarked: [], xp: 0, streak: 0, lastActivity: "", studyPlanDuration: 30,
      sdMastered: [], sdBookmarked: [],
      seCompleted: [],
      lldCompleted: [],
      flashcardKnown: [], flashcardWeak: [],
      createdAt,
    });
    // Seed the public projection (no email here).
    await setDoc(doc(db, "leaderboard", u.uid), {
      username: "", photoURL: u.photoURL, xp: 0, streak: 0,
      solvedCount: 0, activeDays: 0, selectedTrack: "", createdAt,
    }, { merge: true });
  } else {
    // Refresh identity each sign-in so avatar changes propagate.
    await setDoc(ref, {
      displayName: u.displayName, email: u.email, photoURL: u.photoURL,
    }, { merge: true });
    await setDoc(doc(db, "leaderboard", u.uid), { photoURL: u.photoURL }, { merge: true });
  }
}

function hydrateAllStores(d: Record<string, unknown>) {
  useProgressStore.getState().hydrateFromFirestore({
    solved: new Set<string>((d.solved as string[]) ?? []),
    bookmarked: new Set<string>((d.bookmarked as string[]) ?? []),
    weakAreas: new Set<string>((d.weakAreas as string[]) ?? []),
    xp: (d.xp as number) ?? 0,
    streak: (d.streak as number) ?? 0,
    lastActivity: (d.lastActivity as string) ?? "",
    studyPlanDuration: ((raw: number) =>
      raw === 15 ? 21 // legacy 15-day plan was replaced by the 21-day plan
      : [21, 30, 60, 90].includes(raw) ? raw
      : 30
    )(d.studyPlanDuration as number) as 21 | 30 | 60 | 90,
    solvedDates: (d.solvedDates as Record<string, string>) ?? {},
    solveTimes: (d.solveTimes as Record<string, number>) ?? {},
    username: (d.username as string) ?? "",
    planStartDate: (d.planStartDate as string) ?? "",
  });
  usePrepStore.getState().hydrateFromFirestore({
    reviewDue: (d.reviewDue as Record<string, string>) ?? {},
    problemStates: (d.problemStates as never) ?? {},
    selectedTrack: d.selectedTrack as never,
    behavioralDrafts: (d.behavioralDrafts as never) ?? {},
  });
  useSDStore.getState().hydrateFromFirestore({
    mastered: new Set<string>((d.sdMastered as string[]) ?? []),
    bookmarked: new Set<string>((d.sdBookmarked as string[]) ?? []),
  });
  useSEStore.getState().hydrateFromFirestore({
    completed: new Set<string>((d.seCompleted as string[]) ?? []),
  });
  useLLDStore.getState().hydrateFromFirestore({
    completed: new Set<string>((d.lldCompleted as string[]) ?? []),
  });
  useFlashcardStore.getState().hydrateFromFirestore({
    known: new Set<string>((d.flashcardKnown as string[]) ?? []),
    weak: new Set<string>((d.flashcardWeak as string[]) ?? []),
    nextReview: (d.flashcardNextReview as Record<string, string>) ?? {},
    level: (d.flashcardLevel as Record<string, number>) ?? {},
  });
}

async function loadAndSubscribe(uid: string) {
  // Initial load — fast one-time read
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) hydrateAllStores(snap.data() as Record<string, unknown>);

  // Real-time listener — fires on changes from OTHER devices
  if (unsubSnapshot) unsubSnapshot();
  unsubSnapshot = onSnapshot(ref, (s) => {
    if (!s.exists()) return;
    // Skip if we wrote this within the last 3s (our own debounced sync bouncing back)
    if (Date.now() - lastLocalWriteAt < 3000) return;
    hydrateAllStores(s.data() as Record<string, unknown>);
  }, (err) => logError(err, { source: "rt-sync" }));
}

async function syncAllToFirestore(uid: string) {
  const { solved, bookmarked, weakAreas, xp, streak, lastActivity, studyPlanDuration, solvedDates, solveTimes, username, planStartDate } = useProgressStore.getState();
  const { mastered: sdMastered, bookmarked: sdBookmarked } = useSDStore.getState();
  const { completed: seCompleted } = useSEStore.getState();
  const { completed: lldCompleted } = useLLDStore.getState();
  const { known: flashcardKnown, weak: flashcardWeak, nextReview: flashcardNextReview, level: flashcardLevel } = useFlashcardStore.getState();
  const { reviewDue, problemStates, selectedTrack, behavioralDrafts } = usePrepStore.getState();

  const ref = doc(db, "users", uid);
  lastLocalWriteAt = Date.now(); // mark before write to suppress bounce-back

  // Public projection — non-sensitive subset for leaderboard + public profiles.
  await setDoc(doc(db, "leaderboard", uid), {
    username,
    photoURL: auth.currentUser?.photoURL ?? null,
    xp,
    streak,
    solvedCount: solved.size,
    activeDays: new Set(Object.values(solvedDates)).size,
    selectedTrack: selectedTrack ?? "",
  }, { merge: true });

  await updateDoc(ref, {
    solved: Array.from(solved),
    bookmarked: Array.from(bookmarked),
    weakAreas: Array.from(weakAreas),
    xp, streak, lastActivity, studyPlanDuration,
    planStartDate,
    solvedDates,
    solveTimes,
    sdMastered: Array.from(sdMastered),
    sdBookmarked: Array.from(sdBookmarked),
    seCompleted: Array.from(seCompleted),
    lldCompleted: Array.from(lldCompleted),
    flashcardKnown: Array.from(flashcardKnown),
    flashcardWeak: Array.from(flashcardWeak),
    flashcardNextReview,
    flashcardLevel,
    reviewDue,
    problemStates,
    selectedTrack,
    behavioralDrafts,
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) await saveNewUser(result.user);
    }).catch(() => {});

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadAndSubscribe(u.uid);
      else {
        unsubSnapshot?.();
        unsubSnapshot = null;
        useProgressStore.getState().resetForUser();
      }
      setLoading(false);
    });
    return () => { unsub(); unsubSnapshot?.(); unsubSnapshot = null; };
  }, []);

  // Debounced write-back to Firestore on any store change
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    let timer: ReturnType<typeof setTimeout>;

    const syncDebounced = () => {
      clearTimeout(timer);
      timer = setTimeout(() => syncAllToFirestore(uid).catch((e) => logError(e, { source: "sync" })), 1500);
    };

    const u1 = useProgressStore.subscribe(syncDebounced);
    const u2 = useSDStore.subscribe(syncDebounced);
    const u3 = useSEStore.subscribe(syncDebounced);
    const u4 = useFlashcardStore.subscribe(syncDebounced);
    const u5 = usePrepStore.subscribe(syncDebounced);
    const u6 = useLLDStore.subscribe(syncDebounced);

    return () => { u1(); u2(); u3(); u4(); u5(); u6(); clearTimeout(timer); };
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
    unsubSnapshot?.();
    unsubSnapshot = null;
    useProgressStore.getState().resetForUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export { syncAllToFirestore as syncToFirestore };

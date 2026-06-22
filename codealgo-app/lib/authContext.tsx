import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  User,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { auth, db } from "./firebase";
import { useProgressStore } from "./store";
import { useSDStore } from "./sdStore";
import { useSEStore } from "./seStore";
import { useFlashcardStore } from "./flashcardStore";
import { usePrepStore } from "./prepStore";
import { scheduleDailyReviewNotification } from "./notifications";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInError: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInError: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshData: async () => {},
});

// Track last local write to avoid bouncing our own Firestore writes back
let lastLocalWriteAt = 0;
let unsubSnapshot: (() => void) | null = null;

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
      studyPlanDuration: 30,
      sdMastered: [],
      sdBookmarked: [],
      seCompleted: [],
      flashcardKnown: [],
      flashcardWeak: [],
      createdAt: new Date().toISOString(),
    });
  } else {
    // Refresh identity each sign-in so name/avatar changes propagate to leaderboard/profiles.
    await setDoc(ref, {
      displayName: u.displayName,
      email: u.email,
      photoURL: u.photoURL,
    }, { merge: true });
  }
}

function hydrateAllStores(d: Record<string, unknown>) {
  useProgressStore.getState().hydrateFromFirestore({
    solved: new Set<string>((d.solved as string[]) ?? []),
    bookmarked: new Set<string>((d.bookmarked as string[]) ?? []),
    xp: (d.xp as number) ?? 0,
    streak: (d.streak as number) ?? 0,
    lastActivity: (d.lastActivity as string) ?? "",
    studyPlanDuration: ([30, 60, 90].includes(d.studyPlanDuration as number)
      ? d.studyPlanDuration : 30) as 30 | 60 | 90,
    solvedDates: (d.solvedDates as Record<string, string>) ?? {},
    solveTimes: (d.solveTimes as Record<string, number>) ?? {},
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
  useFlashcardStore.getState().hydrateFromFirestore({
    known: new Set<string>((d.flashcardKnown as string[]) ?? []),
    weak: new Set<string>((d.flashcardWeak as string[]) ?? []),
    nextReview: (d.flashcardNextReview as Record<string, string>) ?? {},
    level: (d.flashcardLevel as Record<string, number>) ?? {},
  });
}

async function loadAndSubscribe(uid: string) {
  // Fast initial read
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) hydrateAllStores(snap.data() as Record<string, unknown>);

  // Real-time listener for cross-device sync
  if (unsubSnapshot) unsubSnapshot();
  unsubSnapshot = onSnapshot(ref, (s) => {
    if (!s.exists()) return;
    if (Date.now() - lastLocalWriteAt < 3000) return; // suppress own write bounce-back
    hydrateAllStores(s.data() as Record<string, unknown>);
  }, (err) => console.error("[RT sync]", err));
}

async function tryScheduleNotification() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return;
    const today = new Date().toISOString().split("T")[0];
    const dueCount = Object.values(usePrepStore.getState().reviewDue)
      .filter((d) => d <= today).length;
    await scheduleDailyReviewNotification(dueCount);
  } catch {
    // Notifications optional — never crash the auth flow
  }
}

async function syncAllToFirestore(uid: string) {
  const {
    solved, bookmarked, xp, streak, lastActivity, studyPlanDuration, solvedDates, solveTimes,
  } = useProgressStore.getState();
  const { mastered: sdMastered, bookmarked: sdBookmarked } = useSDStore.getState();
  const { completed: seCompleted } = useSEStore.getState();
  const {
    known: flashcardKnown, weak: flashcardWeak,
    nextReview: flashcardNextReview, level: flashcardLevel,
  } = useFlashcardStore.getState();
  const { reviewDue, problemStates, selectedTrack, behavioralDrafts } = usePrepStore.getState();

  const ref = doc(db, "users", uid);
  lastLocalWriteAt = Date.now(); // mark before write to suppress bounce-back
  await updateDoc(ref, {
    solved: Array.from(solved),
    bookmarked: Array.from(bookmarked),
    xp, streak, lastActivity, studyPlanDuration, solvedDates, solveTimes,
    sdMastered: Array.from(sdMastered),
    sdBookmarked: Array.from(sdBookmarked),
    seCompleted: Array.from(seCompleted),
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [pendingCredential, setPendingCredential] = useState<ReturnType<typeof GoogleAuthProvider.credential> | null>(null);

  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setPendingCredential(credential);
    } else if (response?.type === "error") {
      setSignInError("Google sign-in failed. Please try again.");
    }
  }, [response]);

  useEffect(() => {
    if (!pendingCredential) return;
    signInWithCredential(auth, pendingCredential)
      .then((result) => saveNewUser(result.user))
      .catch((err: { message?: string }) => setSignInError(err.message ?? "Sign-in failed."))
      .finally(() => setPendingCredential(null));
  }, [pendingCredential]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadAndSubscribe(u.uid);
        tryScheduleNotification();
      } else {
        unsubSnapshot?.();
        unsubSnapshot = null;
        useProgressStore.getState().resetForUser();
      }
      setLoading(false);
    });
    return () => { unsub(); unsubSnapshot?.(); unsubSnapshot = null; };
  }, []);

  // Debounced write-back
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    let timer: ReturnType<typeof setTimeout>;
    const sync = () => {
      clearTimeout(timer);
      timer = setTimeout(() => syncAllToFirestore(uid).catch(console.error), 1500);
    };
    const u1 = useProgressStore.subscribe(sync);
    const u2 = useSDStore.subscribe(sync);
    const u3 = useSEStore.subscribe(sync);
    const u4 = useFlashcardStore.subscribe(sync);
    const u5 = usePrepStore.subscribe(sync);
    return () => { u1(); u2(); u3(); u4(); u5(); clearTimeout(timer); };
  }, [user]);

  const signIn = async () => {
    setSignInError(null);
    await promptAsync();
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    unsubSnapshot?.();
    unsubSnapshot = null;
    useProgressStore.getState().resetForUser();
  };

  const refreshData = useCallback(async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) hydrateAllStores(snap.data() as Record<string, unknown>);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signInError, signIn, signOut, refreshData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

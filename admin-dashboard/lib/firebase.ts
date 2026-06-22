import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Fallback to a non-empty dummy key so static prerender at build time (when env
// vars may be absent) doesn't throw auth/invalid-api-key. Real config is used at
// runtime once env vars are present; the dummy never makes network calls.
const resolvedConfig = firebaseConfig.apiKey
  ? firebaseConfig
  : { ...firebaseConfig, apiKey: "build-time-noop", projectId: firebaseConfig.projectId ?? "noop" };

const app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

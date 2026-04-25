import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let cachedApp: FirebaseApp | null = null;

export function firebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  cachedApp = getApps()[0] ?? initializeApp(firebaseConfig);
  return cachedApp;
}

export function firebaseAuth(): Auth {
  return getAuth(firebaseApp());
}

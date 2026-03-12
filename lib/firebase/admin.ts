import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[firebase-admin] Missing required env var: ${name}`);
  }
  return value;
}

function getAdminApp() {
  if (getApps().length) return getApp();

  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const storageBucket = requiredEnv("FIREBASE_STORAGE_BUCKET");

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket
  });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp).bucket();

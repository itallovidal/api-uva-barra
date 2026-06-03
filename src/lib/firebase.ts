import { Env } from "@/validation/env";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

let db: Firestore | null = null;

export function initFirebase({
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
}: Env): Firestore {
  if (db) return db;

  if (getApps().length === 0) {
    initializeApp({
      projectId: FIREBASE_PROJECT_ID,
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  db = getFirestore();
  return db;
}

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Only initialize if we have the required environment variables
let adminApp: ReturnType<typeof initializeApp> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;
let adminDb: ReturnType<typeof getFirestore> | null = null;
let adminStorage: ReturnType<typeof getStorage> | null = null;

if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_STORAGE_BUCKET
) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  // Initialize Firebase Admin
  adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, 'admin') : getApps()[0];

  // Initialize Firebase Admin services
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);
  
  console.log('✅ Firebase Admin initialized successfully');
  console.log(`📊 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
} else {
  console.warn('⚠️  Firebase Admin not initialized - missing environment variables');
  console.warn('Required variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_STORAGE_BUCKET');
}

export { adminAuth, adminDb, adminStorage };
export default adminApp;

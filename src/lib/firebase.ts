import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;
let analytics: Analytics | null = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app, 'us-central1'); // Pin to us-central1 region
  
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app);
  }
  
  console.log('✅ Firebase Client initialized successfully');
  console.log(`📊 Project: ${firebaseConfig.projectId}`);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create mock objects for build time
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
  functions = {} as Functions;
}

// Helper function to force ID token refresh
export const refreshUserToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.getIdToken(true);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

export { auth, db, storage, functions, analytics };
export default app;

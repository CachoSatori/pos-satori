import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzasyDK7jSR3jJU6yXew4XupRA6NIOaDi_rOPI",
  authDomain: "pos-satori.firebaseapp.com",
  projectId: "pos-satori",
  storageBucket: "pos-satori.appspot.com",
  messagingSenderId: "928288148777",
  appId: "1:928288148777:web:fe0dbe000ea5a777a97b38",
};

export const app = initializeApp(firebaseConfig);

// Modern Firestore persistence (recommended for SDK v11+)
initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
export const db = getFirestore(app);

export const auth = getAuth(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Request FCM token
export const requestFCMToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BMTdml9TduHMm_v8pQalTdNMYCs8-ZyUE50czuRio6gNWlgXNqaLbIcn0j9sV7Iz1tl6J5jfOLgZl01HvSq-N3w"
    });
    return token;
  } catch (error) {
    logError(error as Error);
    return null;
  }
};

// Listen for foreground FCM messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  return onMessage(messaging, callback);
};

// Log errors to Analytics
export const logError = (error: Error) => {
  logEvent(analytics, 'exception', {
    description: error.message,
    fatal: false,
  });
};
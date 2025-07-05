import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

// Configuración específica del proyecto pos-satori
const firebaseConfig = {
  apiKey: "AIzaSyBLchTepoC9GFPJ0w3E9GS9B9OFh5ZcZgs",
  authDomain: "pos-satori.firebaseapp.com",
  projectId: "pos-satori",
  storageBucket: "pos-satori.appspot.com",
  messagingSenderId: "928288148777",
  appId: "1:928288148777:web:fe0dbe000ea5a777a97b38"
};

// Evitar inicialización múltiple
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Auth
const auth = getAuth(app);

// Inicializar Firestore con persistencia condicional
const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

const db = isTest
  ? initializeFirestore(app, {}) // Sin persistencia en pruebas
  : initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });

// Inicializar Messaging solo si es soportado
const messagingPromise = isSupported().then((supported) => {
  if (supported) {
    return getMessaging(app);
  }
  return null;
});

export { auth, db, messagingPromise as messaging };

// Solicitar token FCM con la public VAPID key del proyecto
export async function requestFCMToken(): Promise<string | null> {
  try {
    const messaging = await messagingPromise;
    if (!messaging) return null;
    const vapidKey = 'BMTdml9TduHMm_v8pQalTdNMYCs8-ZyUE50czuRio6gNWlgXNqaLbIcn0j9sV7Iz1tl6J5jfOLgZl01HvSq-N3w';
    return await (await import('firebase/messaging')).getToken(messaging, { vapidKey });
  } catch (error) {
    logError(error);
    return null;
  }
}

// Escuchar mensajes en primer plano
export function onForegroundMessage(
  callback: (payload: { notification?: { body?: string } }) => void
): () => void {
  let unsubscribe = () => {};
  messagingPromise.then(messaging => {
    if (messaging) {
      import('firebase/messaging').then(({ onMessage }) => {
        unsubscribe = onMessage(messaging, callback);
      });
    }
  });
  return () => unsubscribe();
}

// Logger simple de errores
export function logError(error: unknown) {
  // Puedes expandir esto para enviar errores a un servicio externo
  console.error(error);
}
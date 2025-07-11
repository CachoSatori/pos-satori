import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
<<<<<<< HEAD
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';

// Configuración específica del proyecto pos-satori
const firebaseConfig = {
  apiKey: 'AIzaSyAUREDOiVcaniG28-Z6aEkj7pppKhUoSlE',
  authDomain: 'pos-satori.firebaseapp.com',
  projectId: 'pos-satori',
  storageBucket: 'pos-satori.appspot.com',
  messagingSenderId: '928288148777',
  appId: '1:928288148777:web:fe0dbe000ea5a777a97b38',
=======
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

// Configuración específica del proyecto pos-satori
const firebaseConfig = {
  apiKey: "AIzaSyAUREDOiVcaniG28-Z6aEkj7pppKhUoSlE",
  authDomain: "pos-satori.firebaseapp.com",
  projectId: "pos-satori",
  storageBucket: "pos-satori.appspot.com",
  messagingSenderId: "928288148777",
  appId: "1:928288148777:web:fe0dbe000ea5a777a97b38"
>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
};

// Evitar inicialización múltiple
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Soporte offline robusto: Firestore con cache persistente y multi-tab
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Inicializar Auth
const auth = getAuth(app);

<<<<<<< HEAD
=======
// Inicializar Firestore
const db = getFirestore(app);

// Habilita persistencia offline (soporte multi-tab)
enableIndexedDbPersistence(db).catch((err) => {
  // Puedes loguear el error si lo deseas
  // console.error('Firestore offline persistence error:', err);
});

>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
// Inicializar Messaging solo si es soportado
const messagingPromise = isSupported().then((supported) => {
  if (supported) {
    return getMessaging(app);
  }
  return null;
});

// Logger simple de errores
interface LogErrorParams {
  error: unknown;
  context?: string;
  details?: string;
}

const logError = ({ error, context, details }: LogErrorParams) => {
  console.error(`Error en ${context || 'Firebase'}:`, error, details || '');
};

// Solicitar token FCM con la public VAPID key del proyecto
const requestFCMToken = async () => {
  try {
    const messaging = await messagingPromise;
    if (!messaging) return null;
    const token = await getToken(messaging, { vapidKey: 'TU_VAPID_KEY' });
    return token;
  } catch (error) {
    logError({ error, context: 'FCM', details: 'Error al obtener token' });
    return null;
  }
};

// Escuchar mensajes en primer plano
const onForegroundMessage = (cb: (payload: any) => void) => {
  let unsubscribe = () => {};
  messagingPromise.then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, cb);
    }
  });
  return () => unsubscribe();
};

export {
  app,
  db,
  auth,
  messagingPromise as messaging,
  logError,
  requestFCMToken,
  onForegroundMessage,
};

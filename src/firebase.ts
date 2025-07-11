import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAUREDOiVcaniG28-Z6aEkj7pppKhUoSlE',
  authDomain: 'pos-satori.firebaseapp.com',
  projectId: 'pos-satori',
  storageBucket: 'pos-satori.appspot.com',
  messagingSenderId: '928288148777',
  appId: '1:928288148777:web:fe0dbe000ea5a777a97b38',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Si tienes funciones auxiliares, agrégalas aquí

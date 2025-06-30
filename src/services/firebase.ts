import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDK7jSR3jJU6yXew4XupRA6NIOaDi_rOPI",
  authDomain: "pos-satori.firebaseapp.com",
  projectId: "pos-satori",
  storageBucket: "pos-satori.firebasestorage.app",
  messagingSenderId: "928288148777",
  appId: "1:928288148777:web:fe0dbe000ea5a777a97b38",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
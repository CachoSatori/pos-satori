import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD-EXAMPLEKEY1234567890abcdefgHIJK',
  authDomain: 'pos-satori.firebaseapp.com',
  projectId: 'pos-satori',
  storageBucket: 'pos-satori.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890abcdef',
  measurementId: 'G-EXAMPLEID',
};

const firebase = initializeApp(firebaseConfig);

export default firebase;
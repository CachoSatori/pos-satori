import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const fixUser = async () => {
  await setDoc(doc(db, 'users', 'iOVvtc1BvPUDdGLb0tKzJ6jUkch1'), {
    role: 'admin',
    email: 'test@satoripos.com'
  });
  console.log('Usuario corregido');
};

fixUser();
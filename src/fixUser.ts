import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

async function fixUser(): Promise<void> {
  try {
    await setDoc(doc(db, 'users', 'iOVvtc1BvPUDdGLb0tKzJ6jUkch1'), {
      role: 'admin',
      email: 'test@satoripos.com'
    });
    console.log('Usuario corregido');
  } catch (error) {
    console.error('Error al corregir usuario:', error);
  }
}

fixUser();
import { auth } from './firebase'; // sin extensión .ts
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Script para crear/corregir usuario admin en Firestore
async function fixUser(): Promise<void> {
  try {
    await setDoc(doc(db, 'users', 'iOVvtc1BvPUDdGLb0tKzJ6jUkch1'), {
      role: 'admin',
      email: 'test@satoripos.com'
    });
    console.log('Usuario corregido');
  } catch (error) {
    console.error('Error al corregir usuario:', error);
    process.exit(1);
  }
}

/**
 * Utilidad para obtener el usuario actual autenticado.
 */
export function getCurrentUser() {
  return auth.currentUser;
}

fixUser();
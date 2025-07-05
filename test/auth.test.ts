import { describe, it, expect } from 'vitest';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase';

// Nota importante: 
// El error "auth/requests-from-referer-<empty>-are-blocked" ocurre porque Firebase Auth REST API
// requiere que el dominio esté autorizado en la consola de Firebase (Authentication > Settings > Authorized domains).
// Para pruebas locales (como Vitest), agrega "localhost" y "127.0.0.1" como dominios autorizados en Firebase Console.
// Si corres en CI, agrega también el dominio temporal del runner si es necesario.

describe('Firebase Auth', () => {
  it('permite login con test@satoripos.com y test1234', async () => {
    const userCredential = await signInWithEmailAndPassword(auth, 'test@satoripos.com', 'test1234');
    expect(userCredential.user.email).toBe('test@satoripos.com');
    expect(userCredential.user.uid).toBe('iOVvtc1BvPUDdGLb0tKzJ6jUkch1');
  });
});
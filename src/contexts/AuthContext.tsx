import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import type { AuthContextType, UserWithRole } from './AuthContextTypes';

/**
 * Contexto de autenticación.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider para el contexto de autenticación.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(firebaseUser as UserWithRole);
            setRole((firebaseUser as UserWithRole).role);
          } else {
            setUser(null);
            setRole(undefined);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error en onAuthStateChanged:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error('Error en onAuthStateChanged:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que useAuth lance error fuera del provider.
 * - Verifica que AuthProvider provea user, loading, login, logout y role correctamente.
 */
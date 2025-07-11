import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as Sentry from '@sentry/react';
import type { Scope } from '@sentry/react';
import type { User } from 'firebase/auth';

export type AuthContextType = {
  user: User | null;
  role?: string;
  setUser: (user: User | null) => void;
  setRole: (role?: string) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, FirebaseError } from 'firebase/auth';
import { auth, logError } from '../firebase';
import type { AuthContextType, UserWithRole } from './AuthContextTypes';

/**
 * Contexto de autenticación.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider para el contexto de autenticación.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(false);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role;
        setUser(user);
        setRole(role as string | undefined);
        Sentry.withScope((scope: Scope) => {
          scope.setUser({ email: user.email ?? undefined, id: user.uid });
          scope.setTag('role', role as string);
        });
      } else {
        setUser(null);
        setRole(undefined);
        Sentry.withScope((scope: Scope) => {
          scope.setUser(null);
          scope.setTag('role', undefined);
        });
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Sentry.captureException(error);
      logError({
        error: error as FirebaseError,
        context: 'AuthContext',
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}`
      });
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
      Sentry.captureException(error);
      logError({
        error: error as FirebaseError,
        context: 'AuthContext',
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}`
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setUser,
        setRole,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que AuthProvider provea user, loading, login, logout y role correctamente.
 */

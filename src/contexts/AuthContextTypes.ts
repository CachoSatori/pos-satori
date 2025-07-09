import type { User } from 'firebase/auth';

/**
 * Interfaz para usuario con rol.
 */
export interface UserWithRole extends User {
  role?: string;
}

/**
 * Interfaz para el contexto de autenticación.
 */
export interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  role: string | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
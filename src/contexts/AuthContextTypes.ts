// Usa el tipo User de Firebase Auth en vez de importarlo de ../types
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

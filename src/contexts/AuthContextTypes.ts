import type { User as FirebaseUser } from 'firebase/auth';

export interface UserWithRole extends FirebaseUser {
  role?: string;
}

export interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  role?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
export type UserRole = 'FARMER' | 'WITNESS' | 'PALIKA' | 'INSURANCE' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

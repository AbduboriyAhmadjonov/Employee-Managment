import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type User = {
  id: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: { id: string; name: string }) => void;
  logout: () => void;
};

export const UserContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);

  const login = (userData: { id: string; name: string }) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}

export const useAuth = () => useContext(UserContext);

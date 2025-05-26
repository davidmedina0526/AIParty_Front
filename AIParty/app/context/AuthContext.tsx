// app/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import {
  db,
  dbRef,
  push,
  set,
  get
} from '../../src/services/firebase';

export interface AppUser {
  id: string;
  email: string;
}

interface AuthContextData {
  user: AppUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Solo para simular carga inicial
  useEffect(() => {
    setInitializing(false);
  }, []);

  const register = async (email: string, password: string) => {
    const usersRef = dbRef(db, 'appUsers');
    const newUserRef = push(usersRef);
    await set(newUserRef, { email, password });
  };

  const login = async (email: string, password: string) => {
    const snap = await get(dbRef(db, 'appUsers'));
    const users = snap.val() || {};
    for (const [id, data] of Object.entries(users)) {
      if (
        (data as any).email === email &&
        (data as any).password === password
      ) {
        setUser({ id, email });
        return;
      }
    }
    throw new Error('Credenciales inválidas');
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, initializing, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

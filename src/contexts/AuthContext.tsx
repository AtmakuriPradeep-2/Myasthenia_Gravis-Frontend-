import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/auth.service";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<void>;
  register: (data: { full_name: string; email: string; username: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    username: string,
    password: string
  ) {
    await authService.login({
      username,
      password,
    });

    const user = await authService.getCurrentUser();
    setUser(user);
  }

  async function register(data: { full_name: string; email: string; username: string; password: string; role: string }) {
    await authService.register(data);
    const user = await authService.getCurrentUser();
    setUser(user);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth() {
  return useContext(AuthContext);
}
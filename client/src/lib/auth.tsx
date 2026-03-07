import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  isOnline: boolean | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: any) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("volts_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao fazer login");
    }

    const userData = await res.json();
    setUser(userData);
    localStorage.setItem("volts_user", JSON.stringify(userData));
    return userData;
  };

  const register = async (data: any): Promise<AuthUser> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erro ao criar conta");
    }

    const userData = await res.json();
    setUser(userData);
    localStorage.setItem("volts_user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("volts_user");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_city");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

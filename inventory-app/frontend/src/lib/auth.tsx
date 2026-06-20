import { createContext, useContext, useState, type ReactNode } from "react";
import { api, tokenStore } from "./api";

interface User { id: number; email: string; name: string; role: "admin" | "staff"; }
interface AuthCtx { user: User | null; login: (email: string, password: string) => Promise<void>; logout: () => void; }

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("inv_user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  async function login(email: string, password: string) {
    const result = await api<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStore.set(result.token);
    localStorage.setItem("inv_user", JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    tokenStore.clear();
    localStorage.removeItem("inv_user");
    setUser(null);
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const hydrate = () => {
      const storedToken = localStorage.getItem("shop_finance_token");
      const storedUser = localStorage.getItem("shop_finance_user");

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      setBooting(false);
    };

    const timer = window.setTimeout(hydrate, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("shop_finance_token", data.token);
    localStorage.setItem("shop_finance_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    router.replace("/dashboard");
  }, [router]);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("shop_finance_token", data.token);
    localStorage.setItem("shop_finance_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    router.replace("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("shop_finance_token");
    localStorage.removeItem("shop_finance_user");
    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, token, booting, isAuthenticated: Boolean(token), login, register, logout }),
    [user, token, booting, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

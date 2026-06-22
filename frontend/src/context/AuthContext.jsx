import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get("/auth/me")
      .then((res) => setUser(res.data.data ?? res.data))
      .catch(() => localStorage.removeItem("auth_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await client.post("/auth/login", { email, password });
    localStorage.setItem("auth_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    const res = await client.post("/auth/register", payload);
    localStorage.setItem("auth_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    try {
      await client.post("/auth/logout");
    } catch {
      // ignore — we're clearing local state regardless
    }
    localStorage.removeItem("auth_token");
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isOrganizer: user?.role === "organizer" || user?.role === "admin",
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

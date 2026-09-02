import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";

type User = { id: string; name: string; email: string; role: string };
type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "uniscout.auth.token";
const USER_KEY = "uniscout.auth.user";

async function save(key: string, value: string) {
  try { await SecureStore.setItemAsync(key, value); } catch { /* web fallback */ }
}
async function read(key: string) {
  try { return await SecureStore.getItemAsync(key); } catch { return null; }
}
async function remove(key: string) {
  try { await SecureStore.deleteItemAsync(key); } catch { /* web fallback */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([read(TOKEN_KEY), read(USER_KEY)]).then(([storedToken, storedUser]) => {
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }).finally(() => setLoading(false)); }, []);
  const complete = async (data: { token: string; user: User }) => {
    await Promise.all([save(TOKEN_KEY, data.token), save(USER_KEY, JSON.stringify(data.user))]);
    setToken(data.token); setUser(data.user);
  };
  const signIn = async (email: string, password: string) => complete(await apiRequest("/auth/login", { method: "POST", body: { email, password } }));
  const signUp = async (name: string, email: string, password: string) => complete(await apiRequest("/auth/register", { method: "POST", body: { name, email, password } }));
  const signOut = async () => { await Promise.all([remove(TOKEN_KEY), remove(USER_KEY)]); setUser(null); };
  return <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }

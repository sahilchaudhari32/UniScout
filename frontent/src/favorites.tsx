import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { College } from "./data";
import { apiRequest } from "./api";
import { useAuth } from "./auth";

type FavoriteContext = {
  favorites: College[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (college: College) => void;
};

const Context = createContext<FavoriteContext>({ favorites: [], isFavorite: () => false, toggleFavorite: () => {} });

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<College[]>([]);

  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    apiRequest<{ items: Array<{ collegeId: College }> }>("/favorites")
      .then((data) => setFavorites(data.items.map((item) => item.collegeId)))
      .catch(() => {});
  }, [user]);

  const toggleFavorite = async (college: College) => {
    const saved = favorites.some((item) => item.id === college.id);
    setFavorites((current) => saved ? current.filter((item) => item.id !== college.id) : [...current, college]);
    try {
      const id = college.backendId || college.id;
      if (saved) await apiRequest("/favorites/" + id, { method: "DELETE" });
      else await apiRequest("/favorites/" + id, { method: "POST" });
    } catch {
      setFavorites((current) => saved ? [...current, college] : current.filter((item) => item.id !== college.id));
    }
  };

  const value = useMemo(() => ({ favorites, isFavorite: (id: string) => favorites.some((item) => item.id === id), toggleFavorite }), [favorites]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useFavorites = () => useContext(Context);

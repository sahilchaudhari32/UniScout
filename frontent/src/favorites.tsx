import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { College } from "./data";
type FavoriteContext = {
  favorites: College[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (college: College) => void;
};
const Context = createContext<FavoriteContext>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
});
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<College[]>([]);
  useEffect(() => { SecureStore.getItemAsync("uniscout.favorites").then(value => { if (value) setFavorites(JSON.parse(value)); }).catch(() => {}); }, []);
  useEffect(() => { SecureStore.setItemAsync("uniscout.favorites", JSON.stringify(favorites)).catch(() => {}); }, [favorites]);
  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (id: string) => favorites.some((item) => item.id === id),
      toggleFavorite: (college: College) =>
        setFavorites((current) =>
          current.some((item) => item.id === college.id)
            ? current.filter((item) => item.id !== college.id)
            : [...current, college],
        ),
    }),
    [favorites],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useFavorites = () => useContext(Context);

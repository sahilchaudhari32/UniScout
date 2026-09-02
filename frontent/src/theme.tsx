import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
export const light = {
  primary: "#175C54",
  accent: "#E6A84A",
  background: "#F7F8F5",
  surface: "#FFFFFF",
  text: "#162522",
  muted: "#71807B",
  border: "#E4E9E4",
  success: "#2C8A65",
  danger: "#C85C53",
  softGreen: "#E8F2EC",
  softGold: "#FFF4DF",
};
export type Palette = typeof light;
export const colors = light;
export const shadow = {
  shadowColor: "#17352E",
  shadowOpacity: 0.08,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};
const ThemeContext = createContext({
  colors: light,
  dark: false,
  toggle: () => {},
});
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => { SecureStore.getItemAsync("uniscout.theme").then(value => { if (value) setDark(value === "dark"); }).catch(() => {}); }, []);
  useEffect(() => { SecureStore.setItemAsync("uniscout.theme", dark ? "dark" : "light").catch(() => {}); }, [dark]);
  const palette = useMemo(
    () =>
      dark
        ? {
            ...light,
            background: "#101A18",
            surface: "#192623",
            text: "#F3F6F2",
            muted: "#9BAAA5",
            border: "#2A3A35",
            softGreen: "#203B35",
            softGold: "#433725",
          }
        : light,
    [dark],
  );
  return (
    <ThemeContext.Provider
      value={{ colors: palette, dark, toggle: () => setDark((v) => !v) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);

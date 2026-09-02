import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../src/theme";
import { FavoritesProvider } from "../src/favorites";
import { AuthProvider } from "../src/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <StatusBar style="dark" />
            <Stack
              initialRouteName="(tabs)"
              screenOptions={{ headerShown: false, animation: "slide_from_right" }}
            />
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

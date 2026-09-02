import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../src/theme";
import { FavoritesProvider } from "../src/favorites";
import { AuthProvider } from "../src/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "../src/auth";

function AuthPrompt() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  if (loading || user || !visible) return null;
  return (
    <Modal transparent animationType="fade" visible>
      <View style={{ flex: 1, backgroundColor: "rgba(7,21,33,.7)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "#F4EBDD", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28 }}>
          <Text style={{ color: "#071521", fontSize: 28, fontWeight: "800" }}>Welcome to UniScout</Text>
          <Text style={{ color: "#53645F", marginTop: 8, marginBottom: 22 }}>Discover campuses that fit your future.</Text>
          <Pressable onPress={() => { setVisible(false); router.push("/(auth)/login"); }} style={{ backgroundColor: "#175C54", borderRadius: 14, padding: 16, alignItems: "center" }}><Text style={{ color: "#fff", fontWeight: "800" }}>Login</Text></Pressable>
          <Pressable onPress={() => { setVisible(false); router.push("/(auth)/register"); }} style={{ borderWidth: 1, borderColor: "#175C54", borderRadius: 14, padding: 16, alignItems: "center", marginTop: 10 }}><Text style={{ color: "#175C54", fontWeight: "800" }}>Sign up</Text></Pressable>
          <Pressable onPress={() => setVisible(false)} style={{ alignItems: "center", padding: 16 }}><Text style={{ color: "#53645F" }}>Continue as guest</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <AuthPrompt />
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

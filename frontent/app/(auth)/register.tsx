import React, { useState } from "react";
import { Link } from "expo-router";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/auth";
import { useTheme } from "../../src/theme";

export default function Register() {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (name.trim().length < 2) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
    if (!/^\+?[0-9 ()-]{8,20}$/.test(phone)) return setError("Enter a valid phone number.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    setBusy(true);
    try { await signUp(name.trim(), email.trim(), phone.trim(), password); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to register"); }
    finally { setBusy(false); }
  }

  const field = (placeholder: string, value: string, setter: (next: string) => void, secure = false) => (
    <TextInput placeholder={placeholder} placeholderTextColor={colors.muted} secureTextEntry={secure}
      keyboardType={placeholder === "Phone number" ? "phone-pad" : placeholder === "Email" ? "email-address" : "default"}
      autoCapitalize={secure ? "none" : "words"} value={value} onChangeText={setter}
      style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 14, padding: 15, marginBottom: 12, color: colors.text }} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "800", color: colors.text }}>Create account</Text>
      <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 24 }}>Start building your college shortlist.</Text>
      {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}
      {field("Full name", name, setName)}
      {field("Email", email, setEmail)}
      {field("Phone number", phone, setPhone)}
      {field("Password", password, setPassword, true)}
      {field("Confirm password", confirm, setConfirm, true)}
      <Pressable disabled={busy} onPress={submit} style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 16, alignItems: "center" }}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "800" }}>Create account</Text>}
      </Pressable>
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <Text style={{ color: colors.muted }}>Already have an account? </Text>
        <Link href={"/(auth)/login" as any} style={{ color: colors.primary, fontWeight: "800" }}>Sign in</Link>
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Header, s } from "../../src/components";
import { useTheme } from "../../src/theme";
import { useAuth } from "../../src/auth";
export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors: c, dark, toggle } = useTheme();
  const [notice, setNotice] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Header
          title="Profile"
          action={
            <Ionicons name="ellipsis-horizontal" size={22} color={c.muted} />
          }
        />
        <View
          style={{ alignItems: "center", paddingVertical: 8, marginBottom: 25 }}
        >
          <View style={[s.avatar, { backgroundColor: c.primary }]}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>
              AS
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "800", color: c.text }}>
            {user?.name || "Student"}
          </Text>
          <Text style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
            {user?.email || ""}
          </Text>
          {user?.phone ? <Text style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>{user.phone}</Text> : null}
          <Pressable
            onPress={() => setNotice(true)}
            style={({ pressed }) => [s.outlineButton, pressed && s.pressed]}
          >
            <Text style={{ color: c.primary, fontWeight: "700", fontSize: 12 }}>
              Edit profile
            </Text>
          </Pressable>
          {notice && (
            <Text style={{ color: c.success, fontSize: 12, marginTop: 8 }}>
              Profile editing is ready to connect.
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 28 }}>
          {[
            ["4", "Saved"],
            ["12", "Viewed"],
            ["3", "Shared"],
          ].map(([a, b]) => (
            <View key={b} style={[s.stat, { backgroundColor: c.surface }]}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: c.text }}>
                {a}
              </Text>
              <Text style={{ color: c.muted, fontSize: 11, marginTop: 4 }}>
                {b}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[s.sectionTitle, { color: c.text, marginBottom: 12 }]}>
          Your space
        </Text>
        {[
          ["Saved colleges", "heart-outline", "4 colleges"],
          ["Recently viewed", "time-outline", "12 colleges"],
          ["Camera", "camera-outline", "Capture campus media"],
          ["Contacts", "people-outline", "Share with contacts"],
          ["Contributions", "cloud-upload-outline", "3 uploads"],
          ["Settings", "settings-outline", "Preferences & privacy"],
          ["Help & support", "help-circle-outline", "We’re here to help"],
        ].map(([label, icon, sub]) => (
          <Pressable
            key={label}
            onPress={() => label === "Camera" ? router.push("/camera" as any) : label === "Contacts" ? router.push("/contacts" as any) : undefined}
            style={({ pressed }) => [
              s.rowItem,
              { backgroundColor: c.surface, borderBottomColor: c.border },
              pressed && s.pressed,
            ]}
          >
            <View style={[s.rowIcon, { backgroundColor: c.softGreen }]}>
              <Ionicons name={icon as any} size={19} color={c.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: c.text, fontWeight: "700", fontSize: 14 }}>
                {label}
              </Text>
              <Text style={{ color: c.muted, fontSize: 12, marginTop: 3 }}>
                {sub}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={c.muted} />
          </Pressable>
        ))}
        <Pressable
          onPress={toggle}
          style={({ pressed }) => [
            s.themeRow,
            { backgroundColor: c.surface },
            pressed && s.pressed,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons
              name={dark ? "moon" : "sunny-outline"}
              size={20}
              color={c.primary}
            />
            <Text style={{ color: c.text, fontWeight: "700" }}>
              Dark appearance
            </Text>
          </View>
          <View
            style={[
              s.switch,
              {
                backgroundColor: dark ? c.primary : c.border,
                alignItems: dark ? "flex-end" : "flex-start",
              },
            ]}
          >
            <View style={s.switchKnob} />
          </View>
        </Pressable>
        <Pressable onPress={() => Alert.alert("Sign out", "Are you sure?", [{ text: "Cancel" }, { text: "Sign out", style: "destructive", onPress: signOut }])} style={({ pressed }) => [s.signout, pressed && s.pressed]}>
          <Text style={{ color: "#C85C53", fontWeight: "800" }}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

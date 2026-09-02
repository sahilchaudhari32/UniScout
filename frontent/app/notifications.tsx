import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "../src/api";
import { Header, s } from "../src/components";
import { useTheme } from "../src/theme";

export default function Notifications() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiRequest<{ items: any[] }>("/notifications").then((data) => setItems(data.items)).finally(() => setLoading(false)); }, []);
  async function open(item: any) {
    if (!item.readAt) { await apiRequest(`/notifications/${item._id}/read`, { method: "PATCH" }); }
    const collegeId = item.collegeIds?.[0];
    if (collegeId) router.push(("/college/" + collegeId) as any);
  }
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}><ScrollView contentContainerStyle={{ padding: 20 }}><Header title="Notifications" action={<Pressable onPress={() => router.back()}><Ionicons name="close" size={24} color={colors.text} /></Pressable>} />{loading ? <ActivityIndicator color={colors.primary} /> : items.length ? items.map((item) => <Pressable key={item._id} onPress={() => open(item)} style={[s.rowItem, { backgroundColor: colors.surface }]}><View style={[s.rowIcon, { backgroundColor: colors.softGreen }]}><Ionicons name="sparkles-outline" size={19} color={colors.primary} /></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: colors.text, fontWeight: item.readAt ? "600" : "800" }}>{item.title}</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{item.message}</Text></View></Pressable>) : <Text style={{ color: colors.muted, textAlign: "center", marginTop: 40 }}>No new recommendations yet.</Text>}</ScrollView></SafeAreaView>;
}

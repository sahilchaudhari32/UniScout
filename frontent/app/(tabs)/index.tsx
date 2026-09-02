import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { categories } from "../../src/data";
import { searchColleges } from "../../src/api";
import {
  CollegeCard,
  Header,
  SearchBar,
  SectionTitle,
  s,
} from "../../src/components";
import { useTheme } from "../../src/theme";

export default function Home() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [collegeData, setCollegeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadColleges() {
    setLoading(true);
    setError("");
    try {
      const result = await searchColleges({ page: 1, limit: 10, sort: "rating" });
      setCollegeData(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load colleges");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadColleges(); }, []);
  const refresh = async () => { setRefreshing(true); await loadColleges(); setRefreshing(false); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={c.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
      >
        <Header
          title="Good morning"
          subtitle="Find a place to grow."
          action={
            <Pressable
              accessibilityLabel="Notifications"
              onPress={() => router.push("/notifications" as any)}
              style={({ pressed }) => [s.notify, pressed && s.pressed]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={c.primary}
              />
              <View style={s.notificationDot} />
            </Pressable>
          }
        />
        <SearchBar />
        <View style={[s.hero, { backgroundColor: c.primary }]}>
          <View style={s.heroGlow} />
          <View style={s.heroEyebrow}>
            <Ionicons name="sparkles" size={13} color={c.accent} />
            <Text style={s.heroEyebrowText}>CURATED FOR YOUR JOURNEY</Text>
          </View>
          <Text style={s.heroTitle}>
            Find the right campus for your future.
          </Text>
          <Text style={s.heroText}>
            Explore trusted colleges, compare what matters and take your next
            step with confidence.
          </Text>
          <Pressable
            style={({ pressed }) => [s.heroButton, pressed && s.pressed]}
            onPress={() => router.push("/(tabs)/search")}
          >
            <Text style={s.heroButtonText}>Start exploring →</Text>
          </Pressable>
          <View style={s.heroTrust}>
            <View style={s.trustAvatars}>
              <View style={[s.trustAvatar, { backgroundColor: "#D6A25A" }]} />
              <View style={[s.trustAvatar, { backgroundColor: "#AFC9BA" }]} />
              <View style={[s.trustAvatar, { backgroundColor: "#E7C7A6" }]} />
            </View>
            <Text style={s.heroTrustText}>Join 12k+ students exploring</Text>
          </View>
        </View>
        <SectionTitle title="Explore by interest" link="See all" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 26 }}
        >
          {categories.map((x, i) => (
            <Pressable
              key={x}
              onPress={() => router.push({ pathname: "/(tabs)/search", params: { interest: x } })}
              style={({ pressed }) => [s.categoryItem, pressed && s.pressed]}
            >
              <View
                style={[
                  s.category,
                  { backgroundColor: i % 2 ? c.softGold : c.softGreen },
                ]}
              >
                <Ionicons
                  name={
                    [
                      "construct",
                      "medkit",
                      "briefcase",
                      "color-palette",
                      "flask",
                      "scale",
                    ][i] as any
                  }
                  size={24}
                  color={i % 2 ? c.accent : c.primary}
                />
              </View>
              <Text style={[s.categoryLabel, { color: c.text }]}>{x}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <SectionTitle title="Near you" link="View all" />
        {loading ? <ActivityIndicator color={c.primary} style={{ marginVertical: 28 }} /> : null}
        {!loading && error ? <Pressable onPress={loadColleges}><Text style={{ color: c.danger, marginBottom: 20 }}>Could not load colleges: {error}. Tap to retry.</Text></Pressable> : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {collegeData.slice(0, 3).map((x) => (
            <CollegeCard
              key={x.id}
              college={x}
              horizontal
              onPress={() => router.push(`/college/${x.id}`)}
            />
          ))}
        </ScrollView>
        <SectionTitle title="Popular this week" link="View all" />
        {collegeData.slice(2).map((x) => (
          <CollegeCard
            key={x.id}
            college={x}
            onPress={() => router.push(`/college/${x.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

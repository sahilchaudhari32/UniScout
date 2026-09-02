import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFavorites } from "../../src/favorites";
import { CollegeCard, EmptyState, Header } from "../../src/components";
import { useTheme } from "../../src/theme";
export default function Favorites() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const { colors: c } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Header
          title="Saved colleges"
          subtitle="Your shortlist, all in one place"
        />
        {favorites.length === 0 ? (
          <EmptyState
            title="Your future campus could be here"
            body="Tap the heart on any college to build your shortlist and compare your favorites later."
            action="Explore colleges"
            onAction={() => router.push("/(tabs)/search")}
          />
        ) : (
          <>
            <Text
              style={{ color: c.primary, fontWeight: "800", marginBottom: 18 }}
            >
              {favorites.length} saved{" "}
              <Text style={{ color: c.muted, fontWeight: "400" }}>
                · Ready to compare
              </Text>
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {favorites.map((x) => (
                <CollegeCard
                  key={x.id}
                  college={x}
                  onPress={() => router.push(`/college/${x.id}`)}
                />
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

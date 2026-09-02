import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { searchColleges } from "../../src/api";
import { CollegeCard, EmptyState, ErrorState, Header, Pill, SearchBar, s } from "../../src/components";
import { useTheme } from "../../src/theme";

const filterOptions = ["All", "Engineering", "Business", "Science", "Arts", "Medical", "Law"];

export default function Search() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ interest?: string }>();
  const [filter, setFilter] = useState(params.interest || "All");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => load(), 350);
    return () => clearTimeout(timer);
  }, [query, filter]);

  async function load(refresh = false) {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(false);
    try {
      const result = await searchColleges({ search: query, course: filter === "All" ? undefined : filter, page: 1, limit: 20, sort: "rating" });
      setItems(result.items);
      setPage(1);
      setHasNextPage(result.hasNextPage);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadMore() {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await searchColleges({ search: query, course: filter === "All" ? undefined : filter, page: nextPage, limit: 20, sort: "rating" });
      setItems((current) => [...current, ...result.items]);
      setPage(nextPage);
      setHasNextPage(result.hasNextPage);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Header title="Discover" subtitle="Find your next chapter" />
        <SearchBar value={query} onChangeText={setQuery} />
        <FlatList horizontal data={filterOptions} keyExtractor={(item) => item} showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}
          renderItem={({ item }) => <Pill label={item} active={item === filter} onPress={() => setFilter(item)} />} />
        {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /> :
          error ? <ErrorState onRetry={() => load()} /> :
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
            ListHeaderComponent={<Text style={[s.sectionTitle, { fontSize: 16, marginBottom: 14 }]}>{items.length} colleges found</Text>}
            ListEmptyComponent={<EmptyState title="No colleges found" body="Try a different name, course, or filter." />}
            renderItem={({ item }) => <CollegeCard college={item} onPress={() => router.push(("/college/" + item.id) as any)} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
            contentContainerStyle={{ paddingBottom: 30 }}
          />}
      </View>
    </SafeAreaView>
  );
}

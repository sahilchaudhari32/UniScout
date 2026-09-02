import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { fetchCollegesWithFallback } from "../../src/api";
import { colleges } from "../../src/data";
import { CollegeCard, Header, Pill, SearchBar, s } from "../../src/components";

const filterOptions = ["All", "Engineering", "Business", "Science", "Arts"];

export default function Search() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [collegeData, setCollegeData] = useState(colleges);

  useEffect(() => {
    fetchCollegesWithFallback().then(setCollegeData);
  }, []);

  const data = useMemo(
    () => collegeData.filter((college) =>
      (filter === "All" || college.courses.includes(filter)) &&
      (college.name + " " + college.city + " " + college.state + " " + college.courses.join(" ")).toLowerCase().includes(query.toLowerCase()),
    ),
    [collegeData, filter, query],
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8F5" }}>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Header title="Discover" subtitle="Find your next chapter" />
        <SearchBar value={query} onChangeText={setQuery} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((option) => (
            <Pill
              key={option}
              label={option}
              active={option === filter}
              onPress={() => setFilter(option)}
            />
          ))}
        </ScrollView>
        <View style={[s.section, { marginTop: 15 }]}>
          <Text style={[s.sectionTitle, { fontSize: 16 }]}>
            {data.length} colleges found
          </Text>
          <Text style={{ color: "#175C54", fontWeight: "700" }}>
            Sort: Recommended
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(x) => x.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CollegeCard
              college={item}
              onPress={() => router.push(`/college/${item.id}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterList: {
    flexGrow: 0,
    height: 53,
    marginHorizontal: -20,
    marginBottom: 2,
  },

  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

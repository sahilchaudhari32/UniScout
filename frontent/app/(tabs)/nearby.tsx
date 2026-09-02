import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useRouter } from "expo-router";
import { fetchNearby } from "../../src/api";
import { College } from "../../src/data";
import { CollegeCard, Header } from "../../src/components";
import { useTheme } from "../../src/theme";

const fallbackRegion: Region = {
  latitude: 28.9388,
  longitude: 77.1013,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function Nearby() {
  const router = useRouter();
  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(fallbackRegion);
  const [collegeData, setCollegeData] = useState<College[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [locationError, setLocationError] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const watcher = useRef<Location.LocationSubscription | null>(null);

  const loadUserLocation = useCallback(async () => {
    setLocationError("");
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
      setLocationError("Location permission was denied."); return;
    }
    const lastKnown = await Location.getLastKnownPositionAsync();
    const location = lastKnown || await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const nextRegion = createRegion(
      location.coords.latitude,
      location.coords.longitude,
    );

    setUserLocation(location.coords);
    setRegion(nextRegion);
    const nearby = await fetchNearby(location.coords.latitude, location.coords.longitude);
    setCollegeData(nearby);
    const address = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    if (address[0]) setLocationError([address[0].city, address[0].region].filter(Boolean).join(", "));
  }, []);

  useEffect(() => {
    loadUserLocation().catch(() => setLocationError("Location services are unavailable."));
    Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, distanceInterval: 100 }, next => {
      setUserLocation(next.coords); setRegion(createRegion(next.coords.latitude, next.coords.longitude));
    }).then(subscription => { watcher.current = subscription; }).catch(() => {});
    return () => watcher.current?.remove();
  }, [loadUserLocation]);

  async function searchLocation() {
    if (!locationQuery.trim()) return;
    try {
      const found = await Location.geocodeAsync(locationQuery.trim());
      if (!found[0]) { setLocationError("Location not found."); return; }
      setRegion(createRegion(found[0].latitude, found[0].longitude));
      setLocationError(locationQuery.trim());
    } catch { setLocationError("Unable to search this location."); }
  }

  function createRegion(latitude: number, longitude: number): Region {
    return {
      latitude,
      longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
  }

  function centerOnUser() {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        createRegion(userLocation.latitude, userLocation.longitude),
      );
      return;
    }

    loadUserLocation();
  }

  function renderCollege({ item }: { item: College }) {
    return (
      <CollegeCard
        college={item}
        onPress={() => router.push(`/college/${item.id}`)}
      />
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={collegeData}
        keyExtractor={(item) => item.id}
        renderItem={renderCollege}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Header
              title="Nearby campuses"
              subtitle="Discover what’s around you"
              action={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Find my location"
                  onPress={centerOnUser}
                  style={({ pressed }) => [
                    styles.locationButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="locate" size={20} color={colors.primary} />
                </Pressable>
              }
            />

            <View style={styles.mapContainer}>
              <View style={styles.locationSearch}>
                <TextInput placeholder="Search a city or campus" value={locationQuery} onChangeText={setLocationQuery} onSubmitEditing={searchLocation} style={styles.locationInput} />
                <Pressable onPress={searchLocation}><Ionicons name="search" size={20} color={colors.primary} /></Pressable>
              </View>
              {locationError ? <Text style={{ color: colors.muted, marginBottom: 8 }}>{locationError}</Text> : null}
              <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsPointsOfInterest={false}
                showsBuildings={false}
                showsTraffic={false}
              >
                {userLocation && (
                  <Marker
                    coordinate={userLocation}
                    title="Your location"
                    pinColor={colors.primary}
                  />
                )}

                {collegeData.map((college) => (
                  <Marker
                    key={college.id}
                    coordinate={college.coordinates}
                    title={college.name}
                    description={`${college.city}, ${college.state}`}
                    pinColor={colors.accent}
                    onCalloutPress={() => router.push(`/college/${college.id}`)}
                  />
                ))}
              </MapView>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsLabel, { color: colors.muted }]}>
                Nearby colleges and universities
              </Text>
              <Text style={[styles.resultsCount, { color: colors.primary }]}>
                {collegeData.length} found
              </Text>
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  locationButton: {
    alignItems: "center",
    backgroundColor: "#E8F2EC",
    borderRadius: 12,
    justifyContent: "center",
    padding: 10,
  },

  mapContainer: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
  },
  locationSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 12,
  },

  map: {
    height: 260,
    width: "100%",
  },

  resultsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultsLabel: {
    fontSize: 13,
  },

  resultsCount: {
    fontSize: 13,
    fontWeight: "700",
  },

  separator: {
    height: 0,
  },

  pressed: {
    opacity: 0.75,
  },
});

import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "../../src/theme";

const items = [
  {
    name: "index",
    label: "Discover",
    icon: "compass-outline",
    activeIcon: "compass",
  },
  {
    name: "search",
    label: "Search",
    icon: "search-outline",
    activeIcon: "search",
  },
  {
    name: "nearby",
    label: "Nearby",
    icon: "location-outline",
    activeIcon: "location",
  },
  {
    name: "favorites",
    label: "Saved",
    icon: "heart-outline",
    activeIcon: "heart",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

function FloatingTabBar({ state }: any) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(progress, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  }, [open, progress]);
  const toggle = () => setOpen((value) => !value);
  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: Math.max(insets.bottom, 12) }]}
    >
      {open && (
        <Pressable onPress={() => setOpen(false)} style={styles.dismissArea} />
      )}
      <View style={styles.menu}>
        {items.map((item, index) => {
          const selected = state.routes[state.index]?.name === item.name;
          const distance = (items.length - index) * 58;
          return (
            <Animated.View
              key={item.name}
              style={[
                styles.option,
                {
                  transform: [
                    {
                      translateY: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -distance],
                      }),
                    },
                    {
                      scale: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.45, 1],
                      }),
                    },
                  ],
                  opacity: progress,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.label}`}
                onPress={() => {
                  router.replace(
                    (item.name === "index"
                      ? "/"
                      : `/(tabs)/${item.name}`) as any,
                  );
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.optionButton,
                  selected && styles.selectedOption,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={(selected ? item.activeIcon : item.icon) as any}
                  size={21}
                  color={selected ? "#fff" : colors.primary}
                />
                <Text
                  style={[styles.optionLabel, selected && styles.selectedLabel]}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? "Close navigation" : "Open navigation"}
        onPress={toggle}
        style={({ pressed }) => [
          styles.fab,
          open && styles.fabOpen,
          pressed && styles.pressed,
        ]}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="nearby" options={{ title: "Nearby" }} />
      <Tabs.Screen name="favorites" options={{ title: "Saved" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  host: { position: "absolute", right: 20, alignItems: "center", zIndex: 20 },
  dismissArea: {
    position: "absolute",
    right: -20,
    bottom: -30,
    width: 1000,
    height: 1000,
  },
  menu: { alignItems: "center", marginBottom: 12 },
  option: { position: "absolute", bottom: 0 },
  optionButton: {
    minWidth: 112,
    height: 46,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    ...shadow,
  },
  selectedOption: { backgroundColor: colors.primary },
  optionLabel: { fontSize: 12, fontWeight: "800", color: colors.primary },
  selectedLabel: { color: "#fff" },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  fabOpen: { backgroundColor: colors.accent },
  pressed: { opacity: 0.78, transform: [{ scale: 0.96 }] },
});

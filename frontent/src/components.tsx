import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { College } from "./data";
import { colors, shadow } from "./theme";
import { useFavorites } from "./favorites";

export function Header({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={s.header}>
      <View>
        <Text style={s.title}>{title}</Text>
        {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}
export function SearchBar({
  placeholder = "Search colleges, courses...",
  value,
  onChangeText,
}: {
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
}) {
  return (
    <View style={s.search}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={s.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name="options-outline" size={20} color={colors.primary} />
    </View>
  );
}
export function CollegeCard({
  college,
  horizontal = false,
  onPress,
}: {
  college: College;
  horizontal?: boolean;
  onPress?: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(college.id);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.card,
        shadow,
        horizontal && s.horizontalCard,
        pressed && s.pressed,
      ]}
    >
      <Image
        source={{ uri: college.image }}
        style={horizontal ? s.horizontalImage : s.cardImage}
      />
      <View style={s.cardBody}>
        <View style={s.row}>
          <Text style={s.cardTitle} numberOfLines={1}>
            {college.name}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              saved
                ? `Remove ${college.name} from saved colleges`
                : `Save ${college.name}`
            }
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              toggleFavorite(college);
            }}
            style={({ pressed }) => [s.heartButton, pressed && s.pressed]}
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={21}
              color={saved ? "#D94D57" : colors.muted}
            />
          </Pressable>
        </View>
        <Text style={s.muted}>
          {college.city}, {college.state} · {college.type}
        </Text>
        <View style={[s.row, { marginTop: 10 }]}>
          <View style={s.row}>
            <Ionicons name="star" size={13} color={colors.accent} />
            <Text style={s.ratingText}>{college.rating}</Text>
          </View>
          <Text style={s.muted}>{college.distance}</Text>
          <View style={s.verified}>
            <Ionicons
              name="checkmark-circle"
              size={14}
              color={colors.success}
            />
            <Text style={s.verifiedText}>Verified</Text>
          </View>
        </View>
        {!horizontal && (
          <View style={s.tags}>
            {college.courses.map((x) => (
              <Text key={x} style={s.tag}>
                {x}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}
export function SectionTitle({
  title,
  link,
}: {
  title: string;
  link?: string;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {link && <Text style={s.link}>{link}</Text>}
    </View>
  );
}
export function Pill({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.pill,
        active && s.activePill,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.pillText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}
export function PrimaryButton({
  label,
  onPress,
  loading = false,
}: {
  label: string;
  onPress?: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.primaryButton,
        pressed && s.pressed,
        loading && s.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={s.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}
export function EmptyState({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.state}>
      <View style={s.stateIcon}>
        <Ionicons name="sparkles-outline" size={25} color={colors.primary} />
      </View>
      <Text style={s.stateTitle}>{title}</Text>
      <Text style={s.stateBody}>{body}</Text>
      {action && <PrimaryButton label={action} onPress={onAction} />}
    </View>
  );
}
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={s.state}>
      <View style={[s.stateIcon, { backgroundColor: "#FBE9E7" }]}>
        <Ionicons
          name="cloud-offline-outline"
          size={25}
          color={colors.danger}
        />
      </View>
      <Text style={s.stateTitle}>Something went wrong</Text>
      <Text style={s.stateBody}>
        We couldn’t load this right now. Check your connection and try again.
      </Text>
      <PrimaryButton label="Try again" onPress={onRetry} />
    </View>
  );
}
export function SkeletonCard() {
  return (
    <View style={[s.card, skeleton]}>
      <View style={s.skeletonImage} />
      <View style={s.cardBody}>
        <View style={s.skeletonLine} />
        <View style={[s.skeletonLine, { width: "60%", marginTop: 10 }]} />
      </View>
    </View>
  );
}

export const s: any = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
  notify: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  hero: { padding: 22, borderRadius: 24, marginBottom: 24 },
  heroTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 31,
    width: "75%",
  },
  heroText: {
    color: "#D8E7E0",
    fontSize: 13,
    marginTop: 8,
    width: "72%",
    lineHeight: 19,
  },
  heroButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 18,
  },
  heroButtonText: { color: "#35240D", fontWeight: "800", fontSize: 13 },
  category: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: colors.text },
  link: { fontSize: 13, fontWeight: "700", color: colors.primary },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.55 },
  cardImage: { width: "100%", height: 160 },
  cardBody: { padding: 14 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  muted: { fontSize: 12, color: colors.muted, marginTop: 5 },
  ratingText: { fontSize: 12, fontWeight: "700", color: colors.text },
  verified: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: colors.success },
  tags: { flexDirection: "row", gap: 7, marginTop: 12 },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: colors.softGreen,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  horizontalCard: { width: 250, marginRight: 14 },
  horizontalImage: { width: "100%", height: 135 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
    minHeight: 44,
  },
  activePill: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.muted, fontWeight: "600", fontSize: 13 },
  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800" },
  state: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    minHeight: 260,
  },
  stateIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  stateTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  stateBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 290,
  },
  skeletonImage: { height: 150, backgroundColor: "#E9EEEA" },
  skeletonLine: {
    height: 14,
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#E9EEEA",
  },
  map: {
    height: 230,
    borderRadius: 24,
    backgroundColor: "#DCE8DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  rowItem: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    margin: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailChip: {
    backgroundColor: colors.softGreen,
    borderRadius: 12,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    height: 140,
    borderRadius: 18,
    backgroundColor: "#DCE8DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  save: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
});
const skeleton = { backgroundColor: colors.surface };
Object.assign(s, {
  outlineButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  themeRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  switch: { width: 44, height: 26, borderRadius: 14, padding: 3 },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  signout: { alignItems: "center", padding: 22 },
});
Object.assign(s, {
  heartButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
Object.assign(s, {
  notificationDot: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D94D57",
    borderWidth: 1,
    borderColor: "#fff",
  },
  heroGlow: {
    position: "absolute",
    right: -50,
    top: -65,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,255,255,.08)",
  },
  heroEyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  heroEyebrowText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#B9D4CA",
  },
  heroTrust: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  trustAvatars: { flexDirection: "row", width: 54 },
  trustAvatar: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: -6,
  },
  heroTrustText: { fontSize: 11, color: "#C5DCD4", fontWeight: "600" },
  categoryItem: { alignItems: "center", marginRight: 18 },
  categoryLabel: { fontSize: 11, fontWeight: "700", marginTop: 7 },
});

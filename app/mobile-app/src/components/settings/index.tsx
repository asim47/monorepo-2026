import EditIcon from "@/assets/icons/EditIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { signOut } from "@/store/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetUser } from "../common/hooks";

export const SettingsComponent = () => {
  const primary = useThemeColor("primary");
  const text = useThemeColor("text");
  const subtitleText = useThemeColor("subtitleText");

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const bottomPadding = useMemo(
    () => Math.max(16, tabBarHeight + insets.bottom + 16),
    [tabBarHeight, insets.bottom]
  );

  const queryClient = useQueryClient();
  const { data: userData } = useGetUser();
  const user = userData?.data;
  console.log("user", user);

  const items = useMemo(
    () => [
      {
        id: "manage",
        title: "Manage Your Nests",
        subtitle: "Manage your created spaces",
        danger: false,
        onPress: () => {},
      },
      {
        id: "history",
        title: "Booking History",
        subtitle: "Here you can find all your past bookings",
        danger: false,
        onPress: () => {},
      },
      {
        id: "wallet",
        title: "My Wallet",
        subtitle: "Manage your finance",
        danger: false,
        onPress: () => {},
      },
      {
        id: "logout",
        title: "Log Out",
        subtitle: "Log out from all devices",
        danger: false,
        onPress: () => {
          queryClient.clear();
          signOut();
        },
      },
      {
        id: "delete",
        title: "Delete Account",
        subtitle: "Delete your account and data",
        danger: true,
        onPress: () => {},
      },
    ],
    []
  );

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: text }]}>Settings</Text>
      </View>
      <Pressable
        hitSlop={10}
        style={({ pressed }) => [
          styles.editBtn,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
        onPress={() => {}}
      >
        <Text style={[styles.editText, { color: primary }]}>Edit</Text>
        <EditIcon width={20} height={20} />
      </Pressable>

      {/* Profile */}
      <View style={styles.profileBlock}>
        <View style={styles.avatarShadow}>
          {user?.profilePhoto ? (
            <Image source={{ uri: user?.profilePhoto }} style={styles.avatar} />
          ) : (
            <Avatar.Text size={120} label={user?.fullName?.charAt(0) ?? "J"} />
          )}
        </View>
        <Text style={[styles.profileName, { color: text }]}>
          {user?.fullName}
        </Text>
        <Text style={[styles.profileEmail, { color: subtitleText }]}>
          {user?.email}
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {items.map((it, idx) => {
          const titleColor = it.danger ? "#FC5C5C" : text;
          return (
            <Pressable
              key={it.id}
              onPress={it.onPress}
              style={({ pressed }) => [
                styles.menuRow,
                pressed && { opacity: 0.98 },
              ]}
            >
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, { color: titleColor }]}>
                  {it.title}
                </Text>
                <Text
                  style={[
                    styles.menuSubtitle,
                    { color: subtitleText },
                    it.danger && { color: subtitleText },
                  ]}
                >
                  {it.subtitle}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#A0A4AA" />

              {idx < items.length - 1 ? <View style={styles.divider} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    height: 40,
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  editText: {
    fontSize: 12,
    fontWeight: "600",
  },

  profileBlock: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 14,
  },
  avatarShadow: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
  },
  profileEmail: {
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    fontWeight: "400",
    marginTop: 2,
  },

  menu: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DFDFDF",
  },
  menuRow: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  menuText: { flex: 1, paddingRight: 12 },
  menuTitle: { fontSize: 16, fontWeight: "600", fontFamily: "Roboto_600SemiBold" },
  menuSubtitle: { fontSize: 14, marginTop: 2, fontFamily: "Roboto_400Regular", fontWeight: "400" },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: 4,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#A6A6A6",
  },
});

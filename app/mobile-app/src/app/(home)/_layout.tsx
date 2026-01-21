
import ChatIcon from "@/assets/icons/ChatIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import ListView from "@/assets/icons/ListView";
import { AuthGuard } from "@/components/common/AuthGuard";
import { Colors } from "@/constants/theme";
import { SplashScreen, Tabs } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      hideSplash();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [hideSplash]);

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: Colors["light"].primary,
          tabBarInactiveTintColor: "#A0A4AA",
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            top: 10,
            flex: 1,
          },
          tabBarStyle: {
            position: "absolute",
            left: 0,
            right: 0,
            marginHorizontal: 18,
            bottom:
              Platform.OS === "android" ? insets.bottom : insets.bottom - 10,
            height: 74,
            borderRadius: 37,
            backgroundColor: "#fff",
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 15,
            paddingHorizontal: 24,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <HomeIcon height={22} width={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="items"
          options={{
            title: "Items",
            tabBarIcon: ({ color }) => (
              <ListView height={22} width={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <ChatIcon height={22} width={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <SettingsIcon height={22} width={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});

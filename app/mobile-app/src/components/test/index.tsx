import { Assets } from "@/constants/Assets";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../common/PrimaryButton";

export const TestComponent = () => {
    const tint = useThemeColor("tint");
  const secondaryText = useThemeColor("secondaryText");

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const bottomPadding = useMemo(
    () => Math.max(16, tabBarHeight + insets.bottom + 16),
    [tabBarHeight, insets.bottom]
  );

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={Assets.light.glass}
          resizeMode="contain"
          style={styles.glass}
        />
      </View>
      <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <PrimaryButton
          label="Start first water test"
          onPress={() => {}}
          buttonStyle={[styles.ctaButton, { backgroundColor: tint }]}
          labelStyle={{ color: secondaryText }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "space-between",
    },
    centerContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    glass: {
      width: 250,
      height: 250,
    },
    footer: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      alignItems: "center",
    },
    ctaButton: {
          borderRadius: 28,
          height: 48,
          width: "90%",
          justifyContent: "center",
      },
  });
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadingStyles } from "@/styles/app";
import { ActivityIndicator, Text, View } from "react-native";

export default function Loading() {
  const primaryText = useThemeColor("text");
  const primary = useThemeColor("tint");

  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color={primary} />
      <Text style={[loadingStyles.text, { color: primaryText }]}>
        Loading...
      </Text>
    </View>
  );
}

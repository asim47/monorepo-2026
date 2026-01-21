import { SettingsComponent } from "@/components/settings";
import { Colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectWithExperts() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <SettingsComponent />
    </SafeAreaView>
  );
}
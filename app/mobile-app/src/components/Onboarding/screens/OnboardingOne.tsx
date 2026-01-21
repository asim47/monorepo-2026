import OnboardingFadedAngledLogo from "@/assets/icons/OnboardingFadedAngledLogo";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import { OnboardingScreenProps } from "./interface";
const OnboardingScreenOne: React.FC<OnboardingScreenProps> = ({ primary }) => {
  const grayText = useThemeColor("grayText");
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 50,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 50,
            textAlign: "center",
            fontWeight: "600",
            lineHeight: 50,
            color: "#000",
          }}
        >
          Find Your{" "}
          <Text style={{ color: primary, fontFamily: "Roboto_600SemiBold" }}>
            Nest
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 26,
            textAlign: "center",
            fontWeight: "400",
            color: grayText,
            fontFamily: "Roboto_400Regular",
          }}
        >
          Private parking, made simple.
        </Text>
      </View>
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
          paddingHorizontal: 24,
        }}
      >
        <OnboardingFadedAngledLogo
          style={{ position: "absolute", top: "20%" }}
        />
      </View>
    </View>
  );
};
  export default OnboardingScreenOne;
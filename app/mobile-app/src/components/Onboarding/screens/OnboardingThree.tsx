import OnboardingCarWithSign from "@/assets/icons/OnboardingCarWithSign";
import { Text, View } from "react-native";
import { OnboardingScreenProps } from "./interface";

const OnboardingScreenThree: React.FC<OnboardingScreenProps> = ({
    primary,
  }) => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* <OnboardingBgBuildings style={{ width: "100%", height: "100%" }} /> */}
        <OnboardingCarWithSign
          style={{ position: "absolute", top: "30%", left: "10%" }}
        />
      </View>
  
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingBottom: 140,
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: "600",
            lineHeight: 40,
            color: '#000',
            fontFamily: "Roboto_600SemiBold",
            marginBottom: 8,
          }}
        >
          Enjoy a Stress-Free Parking Experience
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            fontFamily: "Roboto_600SemiBold",
            color: primary,
          }}
        >
          Park Smart & Save Times
        </Text>
      </View>
    </View>
  );
  export default OnboardingScreenThree;
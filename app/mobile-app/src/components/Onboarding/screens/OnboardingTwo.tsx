import OnboardingCarWithPin from "@/assets/icons/OnboardingCarWithPin";
import { Text, View } from "react-native";
import { OnboardingScreenProps } from "./interface";

const OnboardingScreenTwo: React.FC<OnboardingScreenProps> = ({
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
        <OnboardingCarWithPin
          style={{ position: "absolute", top: "30%", left: "20%" }}
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
            lineHeight: 40,
            fontWeight: "600",
            color: '#000',
            fontFamily: "Roboto_600SemiBold",
            marginBottom: 8,
          }}
        >
          Instant booking with{"\n"}Just One Tap
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: primary,
            fontFamily: "Roboto_600SemiBold",
          }}
        >
          Seamless Parking Booking
        </Text>
      </View>
    </View>
  );
  export default OnboardingScreenTwo;
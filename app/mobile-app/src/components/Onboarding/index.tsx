
import { useIsFirstTime } from "@/hooks/useIsFirstTime";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OnboardingScreenOne from "./screens/OnboardingOne";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Onboarding = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor("background");
  const primary = useThemeColor("primary");
  const textColor = useThemeColor("text");
  const [, setIsFirstTime] = useIsFirstTime();

  const screens = [
    OnboardingScreenOne,
    // OnboardingScreenTwo,
    // OnboardingScreenThree,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  // Stable animated values stored in state (no refs needed in render)
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [translateX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    fadeAnim.setValue(0);
    translateX.setValue(slideDirection * SCREEN_WIDTH);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeIndex, slideDirection, fadeAnim, translateX]);

  const goToNext = () => {
    if (activeIndex === screens.length - 1) {
      setIsFirstTime(false);
      router.replace("/(home)");
      return;
    }
    setSlideDirection(1);
    setActiveIndex((prev) => Math.min(prev + 1, screens.length - 1));
  };

  const goToPrev = () => {
    if (activeIndex === 0) return;
    setSlideDirection(-1);
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    setIsFirstTime(false);
    router.replace("/(home)");
  };

  const CurrentScreen = screens[activeIndex] ?? OnboardingScreenOne;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top bar with Skip */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 8,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Pressable onPress={handleSkip} hitSlop={8}>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontWeight: "600",
              fontFamily: "Roboto_600SemiBold",
            }}
          >
            SKIP
          </Text>
        </Pressable>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateX }],
        }}
      >
        <CurrentScreen primary={primary} textColor={textColor} />
      </Animated.View>

      {/* Bottom navigation with progress and arrows */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 36,
          paddingHorizontal: 32,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back button (only after first slide) */}
        {activeIndex > 0 ? (
          <Pressable
            onPress={goToPrev}
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View style={{ width: 52 }} />
        )}

        {/* Next / Done button */}
        <Pressable
          onPress={goToNext}
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primary,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Feather name="arrow-right" size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
import HomeComponent from "@/components/Home";
import { Colors } from "@/constants/theme";
import React from "react";
import { StatusBar, View } from "react-native";

export default function Home() {
  StatusBar.setBackgroundColor(Colors.light.primary);
  return (
    <View  style={{ flex: 1, backgroundColor: Colors.light.primary }}>
      <HomeComponent/>
    </View>
  )
}


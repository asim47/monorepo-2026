import { Fonts } from "@/constants/fonts";
import React, { useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";

const CustomSliderComponent = React.memo<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    isRange?: boolean;
    rangeEnd?: number;
    onRangeEndChange?: (value: number) => void;
    textColor: string;
    primary: string;
    mutedText: string;
      priceMin?: number;
      priceMax?: number;
  }>(
    ({
      label,
      value,
      onChange,
      min = 0,
      max = 40,
      isRange = false,
      rangeEnd,
      onRangeEndChange,
      textColor,
      primary,
      mutedText,
      priceMin,
      priceMax,
    }) => {
      const [sliderWidth, setSliderWidth] = useState(0);
      const [draggingThumb, setDraggingThumb] = useState<"min" | "max" | null>(
        null
      );
  
      const percentage = ((value - min) / (max - min)) * 100;
      const rangeEndPercentage = rangeEnd
        ? ((rangeEnd - min) / (max - min)) * 100
        : 100;
  
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          if (isRange) {
            const x = evt.nativeEvent.locationX;
            const minX = (percentage / 100) * sliderWidth;
            const maxX = (rangeEndPercentage / 100) * sliderWidth;
            const minDist = Math.abs(x - minX);
            const maxDist = Math.abs(x - maxX);
            setDraggingThumb(minDist < maxDist ? "min" : "max");
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          if (!sliderWidth) return;
          const x = Math.max(0, Math.min(gestureState.moveX, sliderWidth));
          const newValue = min + (x / sliderWidth) * (max - min);
          const roundedValue = Math.round(newValue / 5) * 5; // Round to nearest 5
  
          if (isRange && draggingThumb) {
            if (draggingThumb === "min") {
              const newMin = Math.min(roundedValue, rangeEnd || max);
              onChange(newMin);
            } else {
              const newMax = Math.max(roundedValue, value);
              onRangeEndChange?.(newMax);
            }
          } else {
            onChange(roundedValue);
          }
        },
        onPanResponderRelease: () => {
          setDraggingThumb(null);
        },
      });
  
      return (
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: textColor }]}>
            {label}
          </Text>
          <View
            style={styles.sliderTrack}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
            {...panResponder.panHandlers}
          >
            {isRange ? (
              <>
                <View
                  style={[
                    styles.sliderRange,
                    {
                      left: `${percentage}%`,
                      width: `${rangeEndPercentage - percentage}%`,
                      backgroundColor: primary,
                    },
                  ]}
                />
                <Pressable
                  style={[
                    styles.sliderThumb,
                    { left: `${percentage}%`, backgroundColor: primary },
                  ]}
                  onPressIn={() => setDraggingThumb("min")}
                />
                <Pressable
                  style={[
                    styles.sliderThumb,
                    { left: `${rangeEndPercentage}%`, backgroundColor: primary },
                  ]}
                  onPressIn={() => setDraggingThumb("max")}
                />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${percentage}%`, backgroundColor: primary },
                  ]}
                />
                <Pressable
                  style={[
                    styles.sliderThumb,
                    { left: `${percentage}%`, backgroundColor: primary },
                  ]}
                />
              </>
            )}
          </View>
          <View style={styles.sliderLabels}>
            {Array.from({ length: 9 }, (_, i) => i * 5).map((num) => (
              <Text
                key={num}
                style={[styles.sliderNumber, { color: mutedText }]}
              >
                {num}
              </Text>
            ))}
          </View>
          {isRange && priceMin !== undefined && priceMax !== undefined && (
            <View style={styles.rangeValues}>
              <Text style={[styles.rangeValue, { color: textColor }]}>
                ${priceMin}
              </Text>
              <Text style={[styles.rangeValue, { color: textColor }]}>
                ${priceMax}
              </Text>
            </View>
          )}
        </View>
      );
    }
  );

  const styles = StyleSheet.create({
    sliderContainer: {
        marginBottom: 24,
      },
      sliderLabel: {
        fontSize: 16,
        ...Fonts.Roboto.regular,
        marginBottom: 12,
      },
      sliderTrack: {
        height: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 7,
        position: "relative",
        marginBottom: 8,
      },
      sliderFill: {
        height: 10,
        borderRadius: 7,
        position: "absolute",
        left: 0,
        top: 0,
      },
      sliderRange: {
        height: 10,
        borderRadius: 7,
        position: "absolute",
        top: 0,
      },
      sliderThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        position: "absolute",
        top: -5,
        transform: [{ translateX: -10 }],
        borderWidth: 2,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
      },
      sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0,
      },
      sliderNumber: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Roboto_400Regular",
      },
      rangeValues: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      },
      rangeValue: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Roboto_600SemiBold",
      },
  });

CustomSliderComponent.displayName = 'CustomSlider';

export const CustomSlider = CustomSliderComponent;
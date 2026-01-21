import { useBottomSheet } from "@/context/BottomSheetContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import type { Place } from "@/interfaces/app";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type OpenArgs = {
  places: Place[];
  currentPlaceId: string | null;
  onSelect: (placeId: string) => void;
  onAddNew: () => void;
};

export const usePlacesBottomSheet = () => {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const primary = useThemeColor("primary");
  const text = useThemeColor("text");
  const muted = useThemeColor("secondaryText");

  const open = ({ places, currentPlaceId, onSelect, onAddNew }: OpenArgs) => {
    const Content = () => (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {places.map((p) => {
            const selected = p.id === currentPlaceId;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  onSelect(p.id);
                  closeBottomSheet();
                }}
                style={[styles.placeItem, { backgroundColor: "#F7F7F7" }]}
              >
                <View style={styles.leftIcon}>
                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={primary}
                    />
                  ) : (
                    <Ionicons name="ellipse-outline" size={22} color={muted} />
                  )}
                </View>
                <View style={styles.placeText}>
                  <Text style={[styles.placeName, { color: text }]}>
                    {p.name}
                  </Text>
                  {!!p.address && (
                    <Text
                      style={[styles.placeAddress, { color: text }]}
                      numberOfLines={1}
                    >
                      {p.address}
                    </Text>
                  )}
                </View>
                <View style={styles.rightIcon}>
                  <Ionicons name="create-outline" size={18} color={muted} />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={() => {
            closeBottomSheet();
            onAddNew();
          }}
          style={styles.addRow}
        >
          <Ionicons name="add-circle-outline" size={18} color={primary} />
          <Text style={[styles.addText, { color: primary }]}>Add new place</Text>
        </Pressable>
      </View>
    );

    openBottomSheet({
      title: "Saved Places",
      confirmText: "Close",
      onConfirm: () => {},
      snapPoints: ["50%"],
      children: <Content />,
    });
  };

  return { open };
};

const styles = StyleSheet.create({
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  leftIcon: {
    width: 28,
    alignItems: "center",
  },
  placeText: {
    flex: 1,
    paddingHorizontal: 10,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "700",
  },
  placeAddress: {
    fontSize: 13,
    marginTop: 2,
  },
  rightIcon: {
    width: 24,
    alignItems: "center",
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  addText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default usePlacesBottomSheet;



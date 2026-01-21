import PrimaryButton from "@/components/common/PrimaryButton";
import TextInputComponent from "@/components/common/TextInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from "expo-location";
import { X } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PickedAddress = {
  address: string;
  latitude: number;
  longitude: number;
};

type NominatimResult = {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
};

type LocationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (picked: PickedAddress) => void;
  initialCoordinate?: { latitude: number; longitude: number } | null;
  initialAddress?: string | null;
};

function formatReverseGeocode(item: Location.LocationGeocodedAddress) {
  const parts = [
    item.name,
    item.street,
    item.city ?? item.subregion,
    item.region,
    item.postalCode,
    item.country,
  ]
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);

  // dedupe adjacent repeats
  const out: string[] = [];
  for (const p of parts) {
    if (out[out.length - 1] === p) continue;
    out.push(p);
  }
  return out.join(", ");
}

async function nominatimSearch(query: string, limit = 6) {
  const url =
    "https://nominatim.openstreetmap.org/search" +
    `?format=jsonv2&addressdetails=1&limit=${limit}&q=${encodeURIComponent(
      query
    )}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      // Some environments ignore this; it's still helpful to send.
      "Accept-Language": "en",
    },
  });
  if (!res.ok) throw new Error("Search failed");
  return (await res.json()) as NominatimResult[];
}

export function LocationModal({
  visible,
  onClose,
  onSubmit,
  initialCoordinate,
  initialAddress,
}: LocationModalProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const surface = useThemeColor("background");
  const text = useThemeColor("text");
  const primary = useThemeColor("primary");
  const muted = useThemeColor("subtitleText");
  const card = useThemeColor("inputBackground");

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selected, setSelected] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialCoordinate ?? null);
  const [resolvedAddress, setResolvedAddress] = useState<string>(
    initialAddress?.trim() || ""
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<NominatimResult[]>([]);

  const initialRegion: Region = useMemo(
    () => ({
      latitude: initialCoordinate?.latitude ?? 31.5505,
      longitude: initialCoordinate?.longitude ?? -97.146,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }),
    [initialCoordinate?.latitude, initialCoordinate?.longitude]
  );

  useEffect(() => {
    if (!visible) return;

    // reset transient UI state each open
    setSearchQuery("");
    setSearching(false);
    setSearchError(null);
    setResults([]);
    setPermissionDenied(false);

    const kick = async () => {
      if (initialCoordinate) return;
      setLocating(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setPermissionDenied(true);
          setLocating(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const next = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        // Center map on user's location but don't set as selected
        // Marker will only appear when user explicitly selects a location
        const map = mapRef.current;
        if (map) {
          map.animateToRegion(
            {
              ...next,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            },
            450
          );
        }
        setLocating(false);
      } catch {
        setLocating(false);
      }
    };

    kick();
  }, [visible, initialCoordinate]);

  useEffect(() => {
    if (!visible) return;
    const q = searchQuery.trim();
    if (q.length < 3) {
      setResults([]);
      setSearchError(null);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const t = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const data = await nominatimSearch(q, 6);
        if (cancelled) return;
        setResults(data);
        if (!cancelled) setSearching(false);
      } catch {
        if (cancelled) return;
        setSearchError("Search unavailable");
        setResults([]);
        if (!cancelled) setSearching(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery, visible]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const items = await Location.reverseGeocodeAsync({ latitude, longitude });
      let first = null;
      if (items) {
        if (items.length > 0) {
          first = items[0];
        }
      }
      let formatted = "";
      if (first) {
        formatted = formatReverseGeocode(first);
      }
      if (formatted) {
        setResolvedAddress(formatted);
      }
    } catch {
      // no-op (keep existing address text)
    }
  };

  const onLongPress = async (latitude: number, longitude: number) => {
    setSelected({ latitude, longitude });
    await reverseGeocode(latitude, longitude);
  };

  const chooseResult = async (r: NominatimResult) => {
    const latitude = Number(r.lat);
    const longitude = Number(r.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    setResults([]);
    setSearchQuery(r.display_name);
    setSelected({ latitude, longitude });
    setResolvedAddress(r.display_name);

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      450
    );

    // Try to replace the long "display_name" with OS geocoder formatting.
    await reverseGeocode(latitude, longitude);
  };

  const canSubmit =
    !!selected &&
    Number.isFinite(selected.latitude) &&
    Number.isFinite(selected.longitude) &&
    resolvedAddress.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={[styles.screen, { backgroundColor: surface }]}>
        <View style={[styles.header, { paddingTop: Math.max(8, insets.top) }]}>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.8 }]}
          >
            <X size={22} color={text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: text }]}>
            Select address
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={initialRegion}
            showsUserLocation={!permissionDenied}
            showsMyLocationButton={false}
            onLongPress={(e) =>
              onLongPress(
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude
              )
            }
          >
            {selected && <Marker coordinate={selected} />}
          </MapView>

          <View style={styles.topOverlay} pointerEvents="box-none">
            <View style={[styles.searchCard, { backgroundColor: surface }]}>
              <TextInputComponent
                placeholder="Search places"
                value={searchQuery}
                onChangeText={setSearchQuery}
                inputStyle={styles.searchInput}
                returnKeyType="search"
              />
              {searching && (
                <View style={styles.searchSpinner}>
                  <ActivityIndicator size="small" color={primary} />
                </View>
              )}
            </View>

            {!!searchError && (
              <View style={[styles.toast, { backgroundColor: surface }]}>
                <Text style={{ color: muted, fontSize: 12 }}>{searchError}</Text>
              </View>
            )}

            {results.length > 0 && (
              <View style={[styles.resultsCard, { backgroundColor: surface }]}>
                <FlatList
                  data={results}
                  keyExtractor={(item) => String(item.place_id)}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => chooseResult(item)}
                      style={({ pressed }) => [
                        styles.resultRow,
                        pressed && { backgroundColor: card },
                      ]}
                    >
                      <Text style={[styles.resultText, { color: text }]}>
                        {item.display_name}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>

          {locating && (
            <View style={styles.locatingOverlay}>
              <ActivityIndicator size="large" color={primary} />
            </View>
          )}
        </View>

        <View style={[styles.bottomSheet, { paddingBottom: Math.max(16, insets.bottom + 10) }]}>
          <View style={[styles.addressCard, { backgroundColor: card }]}>
            <Text style={[styles.addressLabel, { color: muted }]}>Address</Text>
            <Text style={[styles.addressValue, { color: text }]} numberOfLines={2}>
              {resolvedAddress.trim().length ? resolvedAddress : "Long-press on map to drop a pin"}
            </Text>
            {permissionDenied && (
              <Text style={[styles.permissionHint, { color: muted }]}>
                Location permission denied. You can still choose by searching or long-pressing on the map.
              </Text>
            )}
          </View>

          <PrimaryButton
            label="Submit"
            disabled={!canSubmit}
            onPress={() => {
              if (!selected) return;
              onSubmit({
                address: resolvedAddress.trim(),
                latitude: selected.latitude,
                longitude: selected.longitude,
              });
              onClose();
            }}
            buttonStyle={[styles.submitBtn, !canSubmit && { backgroundColor: "#9AA3AD" }]}
            labelStyle={styles.submitLabel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  mapWrap: { flex: 1 },
  topOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    paddingHorizontal: 12,
  },
  searchCard: {
    borderRadius: 100,
    padding: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchContainer: {
    borderRadius: 14,
  },
  searchInput: {
    // height: 46,
    fontSize: 14,
  },
  searchSpinner: {
    position: "absolute",
    right: 16,
    top: 24,
  },
  resultsCard: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    maxHeight: 260,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resultRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultText: { fontSize: 13, lineHeight: 18 },
  toast: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  bottomSheet: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  addressCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  addressLabel: { fontSize: 12, fontWeight: "600" },
  addressValue: { fontSize: 14, fontWeight: "600" },
  permissionHint: { fontSize: 12, marginTop: 4 },
  submitBtn: { borderRadius: 100, height: 52, justifyContent: "center" },
  submitLabel: { fontSize: 16, fontWeight: "700" },
});



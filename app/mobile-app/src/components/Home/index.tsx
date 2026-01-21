
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInputComponent from "@/components/common/TextInput";
import { Fonts } from "@/constants/fonts";
import { useThemeColor } from "@/hooks/useThemeColor";
// import {
//   homeFormValidation,
//   HomeFormValidation,
// } from "@/validators/home/search.validations";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { type Region, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PickerMode = "date" | "startTime" | "endTime" | null;

interface NearbySpot {
  id: string;
  title: string;
  location: string;
  startTime: string;
  duration: string;
  status: string;
  rating: number;
}

export const HomeComponent = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const gray = useThemeColor("gray");

  // const {
  //   control,
  //   setValue,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<HomeFormValidation>({
  //   resolver: zodResolver(homeFormValidation),
  //   defaultValues: {
  //     searchQuery: "",
  //     date: new Date(),
  //     startTime: new Date(),
  //     endTime: (() => {
  //       const d = new Date();
  //       d.setHours(d.getHours() + 1);
  //       return d;
  //     })(),
  //     destinationCoordinates: null,
  //   },
  // });

  // Use useWatch for React Compiler compatibility - watches all fields at once
  // const formValues = useWatch({ control });
  // const searchQuery = formValues?.searchQuery ?? "";
  // const date = formValues?.date ?? new Date();
  // const startTime = formValues?.startTime ?? new Date();
  // const endTime = formValues?.endTime ?? new Date();
  // const destinationCoordinates = formValues?.destinationCoordinates ?? null;

  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 31.5493, // Waco, TX (matches screenshot vibe)
    longitude: -97.1467,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;
        setRegion((prev: Region) => ({
          ...prev,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      } catch {
        // If location fails, we keep the default region.
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const nearbyBookings: NearbySpot[] = useMemo(
    () => [
      // {
      //   id: "b1",
      //   title: "New prime parking garage",
      //   location: "12 walton road, DC washington",
      //   startTime: "12 PM on 23-09-2025",
      //   duration: "2 Hours",
      //   status: "Verified",
      //   rating: 4.9,
      // },
      // {
      //   id: "b2",
      //   title: "New prime parking garage",
      //   location: "12 walton road, DC washington",
      //   startTime: "12 PM on 23-09-2025",
      //   duration: "2 Hours",
      //   status: "Verified",
      //   rating: 4.9,
      // },
    ],
    []
  );

  const openPicker = (mode: Exclude<PickerMode, null>) => setPickerMode(mode);
  const closePicker = () => setPickerMode(null);

  const pickerValue = useMemo(() => {
    return new Date();
  }, []);
  //   if (pickerMode === "date") return date;
  //   if (pickerMode === "startTime") return startTime;
  //   if (pickerMode === "endTime") return endTime;
  //   return new Date();
  // }, [pickerMode, date, startTime, endTime]);

  const pickerKind = pickerMode === "date" ? "date" : "time";

  const onPickerConfirm = (selected: Date) => {
    // if (!pickerMode) return;
    // if (pickerMode === "date") setValue("date", selected);
  //   if (pickerMode === "startTime") setValue("startTime", selected);
  //   if (pickerMode === "endTime") setValue("endTime", selected);
  //   closePicker();
  // };

  // const onSubmit = (data: HomeFormValidation) => {
    // Format date as YYYY-MM-DD
    // const formattedDate = moment(data.date).format("YYYY-MM-DD");

    router.push({
      pathname: "/items",
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      />

      {/* Booking cards overlay */}
      <View
        pointerEvents="box-none"
        style={[
          styles.bookingList,
          {
            top: insets.top + 65,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bookingListContent}
        >
          {nearbyBookings.map((b) => (
            <View key={b.id} style={styles.bookingCard}>
              <Pressable
                hitSlop={10}
                style={styles.cardMoreButton}
                onPress={() => {
                  // TODO: open actions menu for this booking
                }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#f0f0f0" />
              </Pressable>

              <View>
                <Image
                  source={require("@/assets/images/homeImage.png")}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.cardBody}>
                <Text
                  style={[styles.cardTitle2, { color: textColor }]}
                  numberOfLines={1}
                >
                  {b.title}
                </Text>

                <Text style={styles.cardLine} numberOfLines={2}>
                  <Text style={styles.cardLabel}>Location :</Text>{" "}
                  <Text style={styles.cardValue}>{b.location}</Text>
                </Text>
                <Text style={styles.cardLine}>
                  <Text style={styles.cardLabel}>Start time :</Text>{" "}
                  <Text style={styles.cardValue}>{b.startTime}</Text>
                </Text>
                <Text style={styles.cardLine}>
                  <Text style={styles.cardLabel}>Duration :</Text>{" "}
                  <Text style={styles.cardValue}>{b.duration}</Text>
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.card,
          {
            bottom:
              Platform.OS === "android"
                ? insets.bottom + 110
                : insets.bottom + 100,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: textColor }]}>
          Where do you want to park?
        </Text>

        <View style={styles.fieldSpacing}>
          <View style={styles.filledField}>
            {/* <Controller
              control={control}
              name="searchQuery"
              render={({ field: { value, onChange } }) => ( */}
                <TextInputComponent
                  placeholder="Enter Destination"
                  // value={value}
                  // onChangeText={onChange}
                  left={
                    <Ionicons name="search" size={18} color={primaryColor} />
                  }
                  onPressIn={() => setShowAddressModal(true)}
                  inputStyle={styles.filledFieldInput}
                  numberOfLines={1}
                  readOnly={true}
                  containerStyle={styles.filledFieldContainer}
                  returnKeyType="search"
                  // error={!!errors.searchQuery?.message}
                  // errorMessage={errors.searchQuery?.message}
                />
              {/* )} */}
            {/* /> */}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.filledField,
              pressed && styles.pressed,
            ]}
            onPress={() => openPicker("date")}
          >
            <View pointerEvents="none">
              {/* <Controller
                control={control}
                name="date"
                render={({ field: { value } }) => ( */}
                  <TextInputComponent
                    placeholder="Choose date"
                    // value={moment(value).format("MMM D, YYYY")}
                    editable={false}
                    left={
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={primaryColor}
                      />
                    }
                    inputStyle={styles.filledFieldInput}
                    containerStyle={styles.filledFieldContainer}
                  />
                {/* )} */}
              {/* /> */}
            </View>
          </Pressable>

          <View style={styles.timeRow}>
            <Pressable
              style={({ pressed }) => [
                styles.timeCell,
                pressed && styles.pressed,
              ]}
              onPress={() => openPicker("startTime")}
            >
              <Text style={[styles.timeLabel, { color: textColor }]}>
                Start Time
              </Text>
              <View style={styles.timeValueRow}>
                {/* <Controller
                  control={control}
                  name="startTime"
                  render={({ field: { value } }) => ( */}
                    <Text style={[styles.timeValue, { color: textColor }]}>
                      {/* {moment(value).format("h:mm A")} */}
                    </Text>
                  {/* )} */}
                {/* /> */}
              </View>
            </Pressable>

            <View style={[styles.timeDivider, { backgroundColor: gray }]} />

            <Pressable
              style={({ pressed }) => [
                styles.timeCell,
                pressed && styles.pressed,
              ]}
              onPress={() => openPicker("endTime")}
            >
              <Text style={[styles.timeLabel, { color: textColor }]}>
                End Time
              </Text>
              <View style={styles.timeValueRow}>
                {/* <Controller
                  control={control}
                  name="endTime"
                  render={({ field: { value } }) => ( */}
                    <Text style={[styles.timeValue, { color: textColor }]}>
                      {/* {moment(value).format("h:mm A")} */}
                    </Text>
                  {/* )} */}
                {/* /> */}
              </View>
            </Pressable>
          </View>

          <PrimaryButton
            label="Search parking"
            onPress={() => {}}
            buttonStyle={styles.searchButton}
            labelStyle={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Roboto_500Medium",
            }}
          />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={!!pickerMode}
        mode={pickerKind}
        date={pickerValue}
        onConfirm={onPickerConfirm}
        onCancel={closePicker}
        customHeaderIOS={() => (
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>
              Select {pickerMode === "date" ? "Date" : "Time"}
            </Text>
          </View>
        )}
        // iOS-only: matches the old spinner feel
        display="spinner"
        // helps with consistent behavior across platforms
        is24Hour={false}
      />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bookingList: {
    position: "absolute",
    left: 16,
    right: 16,
    maxHeight: 280,
  },
  bookingListContent: {
    gap: 12,
    paddingBottom: 6,
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
    alignItems: "flex-start",
  },
  cardMoreButton: {
    position: "absolute",
    right: 0,
    top: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePill: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6F757D",
    fontFamily: "Roboto_500Medium",
  },
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldSpacing: {
    gap: 12,
  },
  filledField: {
    borderRadius: 28,
  },
  filledFieldContainer: {
    justifyContent: "center",
  },
  filledFieldInput: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Roboto_400Regular",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#DADDE2",
  },
  cardBody: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 10,
  },
  cardTitle2: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_600SemiBold",
    marginBottom: 6,
  },
  cardLine: {
    fontSize: 12,
    marginBottom: 2,
  },
  cardLabel: {
    color: "#373D49",
    fontWeight: "500",
    fontFamily: "Roboto_500Medium",
  },
  cardValue: {
    color: "#6F757D",
    fontWeight: "600",
  },
  ratingPill: {
    position: "absolute",
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#22B07D",
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  filledPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F4F6F8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  filledPressableText: {
    fontSize: 14,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#F4F6F8",
    borderRadius: 14,
    overflow: "hidden",
  },
  timeCell: {
    flex: 1,
    paddingHorizontal: 14,
    alignItems: "center",
    paddingVertical: 16,
  },
  timeDivider: {
    marginVertical: 12,
    width: 1,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Roboto_400Regular",
    marginBottom: 12,
  },
  timeValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Roboto_400Regular",
  },
  searchButton: {
    borderRadius: 999,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  pickerHost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  pickerSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...Fonts.Roboto.bold,
    fontSize: 16,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default HomeComponent;
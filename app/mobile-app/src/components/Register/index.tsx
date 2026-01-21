import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import { Assets } from "@/constants/Assets";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { Log } from "@/helpers/Logger";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  RegisterValidation,
  registerValidation,
} from "@/validators/auth/register.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useGetUser } from "../common/hooks";
import { useRegister } from "./register.hooks";

const Register = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const { refetch: getUser } = useGetUser();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const { openBottomSheet } = useBottomSheet();

  const { data: userData } = useGetUser();
  const user = userData?.data;
  const { mutate: register, isPending } = useRegister({
    onSuccess: (res) => {
      Log("Register successful", res);
      getUser();
      router.replace("/");
    },
    onError: (error) => {
      Log("Register failed", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      if (errorMessage.includes("User already exists")) {
        router.push({ pathname: "/login", params: { email: email } });
      } else {
        throw error;
      }
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterValidation>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      fullName: undefined,
      email: email,
      phone: "",
    },
    mode: "onSubmit",
  });

  console.log(errors);
  const titleColor = useThemeColor("text");
  const subtitleColor = useThemeColor("subtitleText");
  const backgroundColor = useThemeColor("background");
  const primaryColor = useThemeColor("primary");
  const textColor = useThemeColor("text");

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("email", user.email);
      setValue("phone", user.phoneNumber);
    }
  }, [user]);

  const onSubmit = async (data: RegisterValidation) => {
    Log("Registering user", data, countryCode);
    try {
      register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        countryCode: countryCode,
      });
    } catch (error) {
      Log("Error registering user", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={100}
      >
        <View style={styles.header}>
          <Image
            source={Assets.light.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: titleColor, fontFamily: "Roboto_600SemiBold" },
            ]}
          >
            Sign Up
          </Text>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Name"
                  keyboardType="default"
                  value={value}
                  error={!!errors.fullName}
                  errorMessage={errors.fullName?.message}
                  editable={!isPending}
                  inputStyle={{
                    fontSize: 14,
                    color: textColor,
                    fontFamily: "Roboto_400Regular",
                  }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  inputStyle={{
                    fontSize: 14,
                    color: textColor,
                    fontFamily: "Roboto_400Regular",
                  }}
                  value={value}
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  editable={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Mobile no"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  inputStyle={{
                    fontSize: 14,
                    color: textColor,
                    fontFamily: "Roboto_400Regular",
                  }}
                  returnKeyType="done"
                  left={
                    <Pressable
                      onPress={() => setShowCountryPicker(true)}
                      style={styles.phoneLeft}
                    >
                      <Text style={{ fontSize: 14, color: primaryColor }}>
                        {countryCode}
                      </Text>
                    </Pressable>
                  }
                />
              )}
            />
            <PrimaryButton
              label="Sign Up"
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              buttonStyle={[
                styles.continueButton,
                { backgroundColor: primaryColor },
              ]}
              labelStyle={{
                fontSize: 18,
                color: "#FFFFFF",
                fontWeight: "500",
                fontFamily: "Roboto_500Medium",
              }}
              isLoading={isPending}
              disabled={!!errors.fullName || !acceptedTerms}
            />
            <View style={styles.termsRow}>
              <Pressable onPress={() => setAcceptedTerms((prev) => !prev)}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: acceptedTerms ? primaryColor : subtitleColor,
                      backgroundColor: acceptedTerms ? primaryColor : "#FFFFFF",
                    },
                  ]}
                >
                  {acceptedTerms && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
              </Pressable>

              <Text
                style={[
                  styles.termsText,
                  { color: subtitleColor, fontFamily: "Roboto_400Regular" },
                ]}
              >
                By continuing you are agreeing to the{" "}
                <Text
                  style={{
                    color: primaryColor,
                    textDecorationLine: "underline",
                  }}
                  onPress={() =>
                    openBottomSheet({
                      title: "Term & Condition",
                      snapPoints: ["65%"],
                      children: (
                        <View style={styles.termsSheetContainer}>
                          <ScrollView
                            style={styles.dialogScrollView}
                            showsVerticalScrollIndicator={false}
                          >
                            <Text
                              style={[styles.dialogText, { color: textColor }]}
                            >
                              Lorium can refer to an ancient Roman village, a
                              home in Rome, a law firm, or a medication, so the
                              correct meaning depends on context. As an ancient
                              village, it was an Etruscan settlement near
                              modern-day Cag di Guido, known for being where
                              Emperor Antoninus Pius was educated and died. As a
                              hotel, it&apos;s an apartment in the Rome area. As
                              a law firm, Lorium Law specializes in various
                              legal services. Finally, as a medication, Lorium
                              is a brand name with context-dependent usage.
                            </Text>
                          </ScrollView>
                        </View>
                      ),
                    })
                  }
                >
                  terms &amp; condition
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.spacer} />

          <CountryPicker
            style={{
              modal: { height: "80%" },
              dialCode: { color: textColor },
              countryName: { color: textColor },
            }}
            show={showCountryPicker}
            lang="en"
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setShowCountryPicker(false);
            }}
            onBackdropPress={() => setShowCountryPicker(false)}
          />

          {/* <View style={styles.bottomRow}>
            <Text
              style={[
                styles.bottomText,
                { color: "#2d3450", fontFamily: "Poppins_400Regular" },
              ]}
            >
              Already have an account?{" "}
              <Text
                onPress={() => router.push("/login")}
                style={[
                  styles.bottomText,
                  styles.bottomLinkText,
                  { color: primaryColor, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                Sign In
              </Text>
            </Text>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 72,
    height: 72,
  },
  content: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
  },
  inputGroup: {
    gap: 20,
    marginTop: 14,
  },
  continueButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  orText: {
    fontSize: 12,
    fontWeight: "500",
  },
  socialWrapper: {
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  signInWith: {
    fontSize: 16,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spacer: {
    height: 24,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: "400",
    flex: 1,
  },
  dialogScrollView: {
    paddingVertical: 8,
  },
  dialogText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
  termsSheetContainer: {
    flex: 1,
    gap: 16,
  },
  termsSheetFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  bottomRow: {
    marginTop: "auto",
    paddingTop: 16,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    includeFontPadding: false,
  },
  bottomLinkText: {
    fontWeight: "700",
  },
  phoneLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#E0E4EC",
  },
});

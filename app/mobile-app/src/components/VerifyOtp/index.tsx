import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OTPInput from "@/components/common/OtpInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useGetUser } from "@/components/common/hooks";
import { Log } from "@/helpers/Logger";
import { useThemeColor } from "@/hooks/useThemeColor";
import { signIn } from "@/store/auth";
import { verifyOtpValidation } from "@/validators/auth/verifyOtp.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
const VerifyOtp = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [otpError, setOtpError] = useState<string | null>(null);
  const { refetch: _getUser } = useGetUser();
  // const { mutate: verifyOtp, isPending } = useVerifyOtp({
  //   onSuccess: (res) => {
  //     Log("OTP verified successfully", res);
  //     if (res.data.accessToken && res.data.refreshToken) {
  //       signIn({
  //         accessToken: res.data.accessToken,
  //         refreshToken: res.data.refreshToken,
  //       });
  //       getUser()
  //         .then((userResult) => {
  //           const data = userResult.data;
  //           const user = data && data.data;

  //           if (user && user.isProfileCompleted) {
  //             router.replace("/");
  //           } else {
  //             router.push({ pathname: "/register", params: { email } });
  //           }
  //         })
  //         .catch((error) => {
  //           Log("Error fetching user after OTP verification", { error });
  //           router.replace("/");
  //         });
  //     } else {
  //       throw new Error("Invalid OTP");
  //     }
  //   },
  //   onError: (error) => {
  //     Log("Error verifying OTP", { error });
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An unknown error occurred";
  //     setOtpError(errorMessage);
  //   },
  // });

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<verifyOtpValidation>({
    resolver: zodResolver(verifyOtpValidation),
    defaultValues: {
      email: email,
      otp: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: verifyOtpValidation) => {
    Log("Submitting OTP", { data });

    // verifyOtp(data);
    // Dev bypass only: replace with real useVerifyOtp when backend is ready. These are not real credentials.
    signIn({
      accessToken: "__DEV_BYPASS_MOCK_TOKEN__",
      refreshToken: "__DEV_BYPASS_MOCK_TOKEN__",
    });
    router.push({ pathname: "/(home)" });
  };

  const titleColor = useThemeColor("text");
  const subtitleColor = useThemeColor("subtitleText");
  const backgroundColor = useThemeColor("background");
  const primaryColor = useThemeColor("primary");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      onTouchStart={Keyboard.dismiss}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={24}
      >
        <View style={styles.container}>
          <View style={styles.inner}>
            {/* <View style={styles.header}>
              <VerifyOTPIcon />
            </View> */}

            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  { color: titleColor, fontFamily: "Roboto_600SemiBold" },
                ]}
              >
                OTP Verification
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: subtitleColor, fontFamily: "Roboto_400Regular" },
                ]}
              >
                A code has been sent to your email
              </Text>
              <View style={styles.emailRow}>
                <Text
                  style={[
                    styles.email,
                    { color: titleColor, fontFamily: "Roboto_400Regular" },
                  ]}
                >
                  {email}
                </Text>
                <Pressable onPress={() => router.replace("/login")}>
                  <Text
                    style={[
                      styles.link,
                      { color: primaryColor, fontFamily: "Roboto_600SemiBold" },
                    ]}
                  >
                    Change
                  </Text>
                </Pressable>
              </View>

              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <OTPInput
                    value={value}
                    maxLength={6}
                    error={errors.otp?.message || otpError}
                    editable={true}
                    onBlur={onBlur}
                    onComplete={(code) => {
                      Log("OTP completed", { code });
                      handleSubmit(onSubmit)();
                    }}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors();
                      setOtpError(null);
                    }}
                  />
                )}
              />

              <View style={styles.resendRow}>
                <Text
                  style={[
                    styles.resendText,
                    { color: titleColor, fontFamily: "Roboto_400Regular" },
                  ]}
                >
                  Didn&apos;t receive your code?
                </Text>
                <Pressable onPress={() => {}}>
                  <Text
                    style={[
                      styles.link,
                      { color: primaryColor, fontFamily: "Roboto_600SemiBold" },
                    ]}
                  >
                    Resend
                  </Text>
                </Pressable>
              </View>
            </View>

            <PrimaryButton
              label={"Verify"}
              onPress={() => handleSubmit(onSubmit)()}
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
              isLoading={false}
              disabled={false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    justifyContent: "space-between",
  },
  inner: {
    flex: 1,
    gap: 30,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
  },
  iconCard: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E1E6F4",
    marginBottom: 8,
  },
  iconDotsRow: {
    flexDirection: "row",
    gap: 6,
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3CB588",
  },
  content: {
    gap: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  email: {
    fontSize: 13,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 28,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resendText: {
    fontSize: 13,
  },
  continueButton: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
});
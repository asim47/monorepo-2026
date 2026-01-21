import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleIcon from "@/assets/icons/GoogleIcon";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import { Assets } from "@/constants/Assets";
import {
  GOOGLE_OAUTH_IOS_CLIENT_ID,
  GOOGLE_OAUTH_WEB_CLIENT_ID,
} from "@/constants/api_keys";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { Log } from "@/helpers/Logger";
import { useThemeColor } from "@/hooks/useThemeColor";
import { signIn } from "@/store/auth";
import {
  LoginValidation,
  loginValidation,
} from "@/validators/auth/login.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import appleAuth from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { Controller, useForm } from "react-hook-form";
import { useGetUser } from "../common/hooks";
import { useSendEmail, useSocialAuth } from "./login.hooks";

GoogleSignin.configure({
  webClientId: GOOGLE_OAUTH_WEB_CLIENT_ID,
  iosClientId: GOOGLE_OAUTH_IOS_CLIENT_ID,
  scopes: ["profile", "email", "openid", "phone"],
  offlineAccess: true,
});

const Login = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidation>({
    resolver: zodResolver(loginValidation),
    mode: "onSubmit",
  });
  console.log(errors);
  const titleColor = useThemeColor("text");
  const subtitleColor = useThemeColor("subtitleText");
  const backgroundColor = useThemeColor("background");
  const primaryColor = useThemeColor("primary");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const textColor = useThemeColor("text");
  const { openBottomSheet } = useBottomSheet();
  const { mutateAsync: sendEmail, isPending } = useSendEmail({
    onSuccess: (data) => {
      Log("Email sent successfully", { data });
    },
    onError: (error) => {
      Log("Error sending email", { error });
      throw error;
    },
  });

  const { refetch: getUser } = useGetUser();

  const { mutateAsync: mutateSocialAuth, isPending: isSocialAuthPending } =
    useSocialAuth({
      onSuccess: (data) => {
        console.log("mutateSocialAuth success", data);
        signIn({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        getUser()
          .then((userResult) => {
            const data = userResult.data;
            const user = data && data.data;

            if (user && user.isProfileCompleted) {
              router.replace("/");
            } else {
              router.push({
                pathname: "/register",
                params: { email: user?.email },
              });
            }
          })
          .catch((error) => {
            Log("Error fetching user after OTP verification", { error });
            router.replace("/");
          });
      },
      onError: (error) => {
        Log("Error social auth", { error });
        Alert.alert("Error", error.message);
      },
    });

  const onSubmit = async (data: LoginValidation) => {
    Log("Sending email", { data });
    try {
      await sendEmail({ email: data.email.toLowerCase() });
      router.push({
        pathname: "/verifyOtp",
        params: { email: data.email.toLowerCase() },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      Log("Error sending email", { error: errorMessage });
      Alert.alert("Error", errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("handleGoogleSignIn");
      await GoogleSignin.hasPlayServices();
      console.log("hasPlayServices");
      const userInfo = await GoogleSignin.signIn({});
      console.log("Full userInfo response:", JSON.stringify(userInfo, null, 2));

      if (isSuccessResponse(userInfo)) {
        console.log("userInfo.data:", JSON.stringify(userInfo.data, null, 2));
        console.log("idToken present:", !!userInfo.data.idToken);
        console.log("idToken value:", userInfo.data.idToken);

        if (!userInfo.data.idToken) {
          Alert.alert(
            "Error",
            "No idToken received from Google Sign-In. Please check your configuration."
          );
          return;
        }

        const response = await mutateSocialAuth({
          email: userInfo.data.user.email,
          provider: "google",
          providerData: {
            idToken: userInfo.data.idToken,
          },
        });
        console.log("response", response);
      } else {
        throw new Error("Google sign in failed");
      }
    } catch {
      // Handle error silently
    }
  };

  const handleAppleSignIn = async () => {
    try {
      if (appleAuth.isSupported) {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          // Note: it appears putting FULL_NAME first is important, see issue #293
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        console.log("appleAuthRequestResponse", appleAuthRequestResponse);

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user
        );
        console.log("credentialState", credentialState);

        // use credentialState response to ensure the user is authenticated
        // if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        const response = await mutateSocialAuth({
          email: appleAuthRequestResponse.email ?? undefined,
          fullName: appleAuthRequestResponse.fullName
            ? appleAuthRequestResponse.fullName.givenName +
              (appleAuthRequestResponse.fullName.familyName
                ? ` ${appleAuthRequestResponse.fullName.familyName}`
                : "")
            : undefined,
          provider: "apple",
          providerData: {
            idToken: appleAuthRequestResponse.identityToken,
          },
        });
        console.log("response", response);
        // }
      } else {
        Alert.alert("Apple is not supported on this device");
      }
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "An unknown error occurred"
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // enableOnAndroid
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
            Sign In
          </Text>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  disabled={isPending || isSocialAuthPending}
                  onChangeText={onChange}
                  inputStyle={{
                    fontSize: 14,
                    color: textColor,
                    fontFamily: "Roboto_400Regular",
                  }}
                  onBlur={onBlur}
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  returnKeyType="done"
                />
              )}
            />
            <PrimaryButton
              label="Sign In"
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              buttonStyle={[
                styles.continueButton,
                { backgroundColor: primaryColor },
              ]}
              labelStyle={{
                fontSize: 14,
                color: "#FFFFFF",
                fontWeight: "400",
                fontFamily: "Roboto_400Regular",
              }}
              isLoading={isPending || isSocialAuthPending}
              disabled={
                isPending ||
                isSocialAuthPending ||
                !!errors.email ||
                !acceptTerms
              }
            />
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsRow}>
            <Pressable onPress={() => setAcceptTerms((prev) => !prev)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: acceptTerms ? primaryColor : subtitleColor,
                    backgroundColor: acceptTerms ? primaryColor : "#FFFFFF",
                  },
                ]}
              >
                {acceptTerms && (
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
                onPress={() =>
                  openBottomSheet({
                    title: "Term & Condition",
                    snapPoints: ["65%"],
                    children: (
                      <View style={styles.termsSheetContainer}>
                        <KeyboardAwareScrollView
                          style={styles.dialogScrollView}
                          showsVerticalScrollIndicator={false}
                        >
                          <Text
                            style={[styles.dialogText, { color: textColor }]}
                          >
                            Lorium can refer to an ancient Roman village, a home
                            in Rome, a law firm, or a medication, so the correct
                            meaning depends on context. As an ancient village,
                            it was an Etruscan settlement near modern-day Cag di
                            Guido, known for being where Emperor Antoninus Pius
                            was educated and died. As a hotel, it&apos;s an
                            apartment in the Rome area. As a law firm, Lorium
                            Law specializes in various legal services. Finally,
                            as a medication, Lorium is a brand name with
                            context-dependent usage.
                          </Text>
                        </KeyboardAwareScrollView>
                      </View>
                    ),
                  })
                }
                style={{
                  color: primaryColor,
                  textDecorationLine: "underline",
                }}
              >
                Terms &amp; Condition
              </Text>
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View
              style={[
                styles.divider,
                { backgroundColor: subtitleColor, opacity: 0.3 },
              ]}
            />
            <Text
              style={[styles.orText, { color: subtitleColor, opacity: 0.3 }]}
            >
              OR
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: subtitleColor, opacity: 0.3 },
              ]}
            />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialWrapper}>
            <Text
              style={[
                styles.signInWith,
                { color: subtitleColor, fontFamily: "Poppins_500Medium" },
              ]}
            >
              Sign in with
            </Text>
            <View style={styles.socialRow}>
              {/* Apple Button - iOS only */}
              {Platform.OS === "ios" && (
                <Pressable
                  style={[styles.socialButton]}
                  onPress={handleAppleSignIn}
                  disabled={isSocialAuthPending || isPending}
                >
                  <Ionicons name="logo-apple" size={30} />
                </Pressable>
              )}
              {/* Google Button */}
              <Pressable
                style={[styles.socialButton]}
                disabled={isSocialAuthPending || isPending}
                onPress={handleGoogleSignIn}
              >
                <GoogleIcon width={30} height={30} />
              </Pressable>
            </View>
          </View>

          <View style={styles.spacer} />
          {/* <View style={styles.bottomRow}>
            <Text
              style={[
                styles.bottomText,
                { color: "#2d3450", fontFamily: "Poppins_400Regular" },
              ]}
            >
              Don&apos;t have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text
                style={[
                  styles.bottomText,
                  {
                    color: primaryColor,
                    fontWeight: "bold",
                    fontFamily: "Poppins_600SemiBold",
                  },
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    gap: 5,
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
    marginTop: 24,
  },
  continueButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 11,
    flex: 1,
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
    marginTop: 8,
  },
  signInWith: {
    fontSize: 16,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
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
    elevation: 0,
  },
  spacer: {
    height: 50,
  },
  bottomRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
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
});
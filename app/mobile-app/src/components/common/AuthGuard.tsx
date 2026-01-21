import { useIsFirstTime } from "@/hooks/useIsFirstTime";
import { useAuth } from "@/store/auth";
import { Redirect } from "expo-router";
import React from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (status === "signedOut") {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};


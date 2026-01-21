import { mockSendOTP, mockSocialAuth } from "@/services/mock/auth.mock";
import { AuthSuccessResponse } from "@/interfaces/app";
import { LoginValidation } from "@/validators/auth/login.validations";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook to send OTP to user's email
 * Uses mock service - returns mock OTP: 123456
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockSendOTP with apiRequest call to /auth/send-otp
 */
export const useSendEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: LoginValidation) => mockSendOTP(data.email),
    onSuccess,
    onError,
  });
};

/**
 * Hook for social authentication (Google/Apple)
 * Uses mock service
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockSocialAuth with apiRequest call to /auth/oauth-login
 */
export const useSocialAuth = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: AuthSuccessResponse) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: { provider: 'google' | 'apple'; token: string }) => 
      mockSocialAuth(data),
    onSuccess,
    onError,
  });
};
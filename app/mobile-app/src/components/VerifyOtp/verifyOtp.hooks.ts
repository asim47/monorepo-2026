import { mockVerifyOTP } from "@/services/mock/auth.mock";
import { AuthSuccessResponse } from "@/interfaces/app";
import { verifyOtpValidation } from "@/validators/auth/verifyOtp.validations";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook for OTP verification
 * Uses mock service - accepts OTP: 123456
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockVerifyOTP with apiRequest call to /auth/verify-otp
 */
export const useVerifyOtp = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { data: AuthSuccessResponse }) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: async (data: verifyOtpValidation) => {
      const result = await mockVerifyOTP(data.email, data.otp);
      return { data: result };
    },
    onSuccess,
    onError,
  });
};
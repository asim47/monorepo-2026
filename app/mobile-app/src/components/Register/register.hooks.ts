import { mockRegister } from "@/services/mock/auth.mock";
import { RegisterValidation } from "@/validators/auth/register.validations";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook for user registration
 * Uses mock service - automatically succeeds and sends mock OTP
 * 
 * To use real API:
 * 1. Set USE_MOCK_API = false in constants/api_keys
 * 2. Replace mockRegister with apiRequest call to /user/
 */
export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (data: RegisterValidation) => mockRegister(data),
    onSuccess,
    onError,
  });
};

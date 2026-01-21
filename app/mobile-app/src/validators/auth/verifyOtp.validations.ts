import { z } from "zod";

export const verifyOtpValidation = z
  .object({
    email: z
      .string({ error: "Email is required" })
      .email({ message: "Invalid email address" }),
    otp: z
      .string({ error: "OTP is required" })
      .min(1, { message: "OTP is required" })
      .max(6, { message: "OTP must be 6 digits" }),
  })
  .strict();

export type verifyOtpValidation = z.infer<typeof verifyOtpValidation>;
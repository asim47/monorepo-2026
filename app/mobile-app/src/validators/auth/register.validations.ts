import { z } from "zod";

export const registerValidation = z
  .object({
    fullName: z
      .string({ message: "Name is required" })
      .min(1, { message: "Name is required" }),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
  })
  .strict();

export type RegisterValidation = z.infer<typeof registerValidation>;
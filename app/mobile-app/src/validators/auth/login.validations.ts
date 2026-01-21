import { z } from "zod";

export const loginValidation = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
  })
  .strict();

export type LoginValidation = z.infer<typeof loginValidation>;

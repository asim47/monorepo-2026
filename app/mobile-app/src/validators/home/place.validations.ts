import { z } from "zod";

export const createPlaceValidation = z.object({
  name: z.string().min(1, "Place name is required"),
  address: z.string().min(1, "Address is required"),
});

export type CreatePlaceValidation = z.infer<typeof createPlaceValidation>;

// Validation schemas for items
import { z } from 'zod';

export const itemSearchValidationSchema = z.object({
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
  radius: z.number().min(100).max(50000).optional(),
  query: z.string().optional(),
});

export type ItemSearchValidation = z.infer<typeof itemSearchValidationSchema>;

export const itemIdValidationSchema = z.object({
  id: z.string().min(1),
});

export type ItemIdValidation = z.infer<typeof itemIdValidationSchema>;

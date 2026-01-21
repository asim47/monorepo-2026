// Validation schemas for item filters
import { z } from 'zod';

export const filterValidationSchema = z.object({
  category: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  radius: z.number().min(100).max(50000).optional(), // in meters
  sortBy: z.enum(['distance', 'price-low', 'price-high', 'rating', 'newest']).optional(),
});

export type FilterValidation = z.infer<typeof filterValidationSchema>;

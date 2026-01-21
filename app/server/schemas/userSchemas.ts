import { z } from 'zod';

// User status enum (matches Prisma UserStatus enum)
export const userStatusSchema = z.enum(['Active', 'Blocked']);

// User validation schemas
export const getUserParamsSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  status: userStatusSchema.optional(), // Optional, defaults to 'Active' in database
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  status: userStatusSchema.optional(),
});

// User response schema (matches Prisma User model)
// Note: Prisma DateTime fields are serialized as ISO strings in JSON responses
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: userStatusSchema,
  createdAt: z.string(), // ISO 8601 datetime string (serialized from Date)
  updatedAt: z.string(), // ISO 8601 datetime string (serialized from Date)
});

// Response schemas
export const usersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(userSchema),
  count: z.number(),
});

export const createUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userSchema,
});

export const getUserResponseSchema = z.object({
  success: z.boolean(),
  data: userSchema,
});

// Type exports derived from schemas
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

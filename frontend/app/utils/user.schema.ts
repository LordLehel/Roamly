import { z } from 'zod';

export const userProfileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address format').optional(),
  phone: z.string().optional(),
  // Here you can add more fields like avatar, bio, etc
});

export type UserProfile = z.infer<typeof userProfileSchema>;
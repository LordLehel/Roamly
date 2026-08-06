import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username too short! It must be atleast 3 characters long!')
    .max(50, 'Username too long! It can not be more than 50 characters long!'),
  email: z.email('Email address format not recognized!'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be between 8-72 characters long!')
    .max(72, 'Password must be between 8-72 characters long!')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase character!')
    .regex(/[a-z]/, 'Password must contain at least one lowercase character!')
    .regex(/[0-9]/, 'Password must contain at least one number!'),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// frontend/app/utils/schemas/users.validation.ts
import { z } from 'zod';

export const updateUsernameSchema = z.object({
  username: z
    .string('Please enter a valid username!')
    .min(3, 'Username too short! It must be atleast 3 characters long!')
    .max(50, 'Username too long! It can not be more than 50 characters long!'),
});

export const updateEmailSchema = z.object({
  email: z.string('Please enter a valid email!').email('Email address format not recognized'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string({ message: 'Old password is required!' }),
  newPassword: z
    .string()
    .trim()
    .min(8, 'Password must be between 8-72 characters long!')
    .max(72, 'Password must be between 8-72 characters long!')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase character!')
    .regex(/[a-z]/, 'Password must contain at least one lowercase character!')
    .regex(/[0-9]/, 'Password must contain at least one number!'),
});

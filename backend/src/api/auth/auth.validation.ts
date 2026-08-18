import { z } from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';

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
  phone_number: z
    .string()
    .transform((val: string, ctx: z.RefinementCtx) => {
      const phoneNumber = parsePhoneNumberFromString(val);

      if (!phoneNumber || !phoneNumber.isValid()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid phone number! Regional code must be included (e.g. +40)',
        });

        return z.NEVER;
      }

      // returns the value with the regional code included (+40...)
      return phoneNumber.number;
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

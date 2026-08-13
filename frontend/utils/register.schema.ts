import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Incorrect email address format!'),
  username: z.string().min(3, 'The username must be at least 3 characters long!'),
  phone: z.string().regex(/^\+\d{1,4}[\s\d]{6,14}$/, 'Incorrect phone number format (ex. +40 712 345 678)'),
  password: z.string().min(8, 'The password must be at least 8 characters long!'),
  repeatPassword: z.string()
}).refine((data) => data.password === data.repeatPassword, {
  message: "The passwords don't match!",
  path: ["repeatPassword"],
});


export type RegisterFormState = z.infer<typeof registerSchema>;
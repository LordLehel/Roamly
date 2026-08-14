import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Incorrect email address format!'),
  password: z.string().min(1, 'Password is required!'),
});

export type LoginFormState = z.infer<typeof loginSchema>;

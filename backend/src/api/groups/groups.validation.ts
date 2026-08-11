import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Group name too short! It must be atleast 3 characters long!')
    .max(64, 'Group name too long! It must be shorter than 64 characters!')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
    ),
});

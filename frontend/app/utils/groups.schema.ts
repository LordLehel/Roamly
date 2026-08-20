// frontend/app/utils/groups.schema.ts
import { z } from 'zod';

export const createGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, 'The group name must be at least 3 characters long!')
    .max(64, 'The group name must be shorter than 64 characters!')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'The group name can only contain letters, numbers, spaces, hyphens and underscores!',
    ),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
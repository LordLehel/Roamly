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

export const updateGroupSchema = z.object({
  groupName: z.string().trim().min(3, 'Minimum 3 characters required!').max(64, 'Maximum 64 characters allowed!'),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email format!'),
  role: z.enum(['invitedMember', 'invitedLeader'], {
    message: 'Please select a valid role!',
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

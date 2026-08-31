// frontend/app/utils/schemas/groups.schema.ts
import { z } from 'zod';

export const createGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, 'Group name too short! It must be atleast 3 characters long!')
    .max(64, 'Group name too long! It must be shorter than 64 characters!')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
    ),
});

export const updateGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, 'Group name too short! It must be atleast 3 characters long!')
    .max(64, 'Group name too long! It must be shorter than 64 characters!')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
    ),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid Email Format!'),
  role: z.enum(['invitedMember', 'invitedLeader'], {
    message: 'Role must be either "invitedMember" or "invitedLeader"!',
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

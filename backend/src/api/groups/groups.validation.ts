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
  initialInvites: z
    .array(
      z.object({
        email: z.string().email('invalid email adress format!'),
        role: z.enum(['invitedMember', 'invitedLeader'], {
          message: 'Role must be either "invitedMember" or "invitedLeader"!',
        }),
      }),
    )
    .max(50, 'You can only invite up to 50 users at once!')
    .optional(),
});

export const updatedGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Group name too short! It must be atleast 3 characters long!')
    .max(64, 'Group name too long! It must be shorter than 64 characters!')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Group name can only contain letters, numbers, spaces, hyphens and underscores!',
    )
    .optional(),
});

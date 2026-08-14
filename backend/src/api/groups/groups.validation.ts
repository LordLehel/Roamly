import { z } from 'zod';
import { ROLES } from '../../constants/roles.constants';

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
        role: z.enum([ROLES.INVITEDMEMBER, ROLES.INVITEDLEADER], {
          message: `Role must be either "${ROLES.INVITEDMEMBER}" or "${ROLES.INVITEDLEADER}"!`,
        }),
      }),
    )
    .max(50, 'You can only invite up to 50 users at once!')
    .optional(),
});

export const listGroupsSchema = z.object({
  limit: z.coerce
    .number({ message: 'limit parameter must be a number!' })
    .int('limit parameter must be an integer!')
    .min(1, 'limit parameter must be greater than or equal to 1!')
    .max(50, 'limit parameter must be less than or equal to 50!')
    .default(15),

  cursor: z.uuid({ message: 'Invalid cursor format! Cursor must be a valid UUID!' }).optional(),
});

export const groupUuidValidationSchema = z.object({
  groupUuid: z.uuid({ message: 'groupUuid parameter must be valid UUID!' }),
});

export const inviteUsersToYourGroupBodySchema = z.object({
  invitedUserEmail: z.email('Invalid Email Format!'),

  inviteWithRole: z.enum([ROLES.INVITEDLEADER, ROLES.INVITEDMEMBER], {
    message: `Role must be either "${ROLES.INVITEDMEMBER}" or "${ROLES.INVITEDLEADER}"!`,
  }),
});

export const removeUserFromGroupByEmailSchema = z.object({
  groupUuid: z.uuid({ message: 'groupUuid parameter must be valid UUID!' }),

  email: z.email('Invalid Email Format!'),
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

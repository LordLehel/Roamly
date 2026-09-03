import { z } from 'zod';
import { EVENT_VISIBILITY } from '../../constants/events.constants';

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title must be at least 1 character long!')
      .max(64, 'Title must be shorter than 64 characters long!'),

    description: z
      .string()
      .trim()
      .max(255, 'Description can not be longer than 255 characters!')
      .optional(),

    start_time: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)'),

    end_time: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    visibility: z.enum([EVENT_VISIBILITY.PUBLIC, EVENT_VISIBILITY.PRIVATE], {
      message: `Visibility is required and must be either ${EVENT_VISIBILITY.PUBLIC} or ${EVENT_VISIBILITY.PRIVATE}`,
    }),

    participant_emails: z
      .array(z.email('One or more email addresses does not have a valid format!'))
      .refine((emails: string[]) => new Set(emails).size === emails.length, {
        message: 'The list contains duplicate email addresses!',
      })
      .optional(),
  })
  .refine(
    (data: { start_time: string; end_time?: string }) => {
      if (data.end_time) {
        return new Date(data.end_time) >= new Date(data.start_time);
      }

      return true;
    },
    {
      message: 'End time must be after the start time, or the exact same!',
      path: ['end_time'],
    },
  )
  .refine(
    (data: { visibility: string; participant_emails?: string[] }) => {
      if (
        data.visibility === EVENT_VISIBILITY.PUBLIC &&
        data.participant_emails &&
        data.participant_emails.length > 0
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Public events can not have specified participants, every user in the group will be a participant!',
      path: ['participant_emails'],
    },
  );

export const groupUuidParamSchema = z.object({
  groupUuid: z.uuid('Invalid group UUID format!'),
});

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title must be at least 1 character long!')
      .max(64, 'Title must be shorter than 64 characters long!')
      .optional(),

    description: z
      .string()
      .trim()
      .max(255, 'Description can not be longer than 255 characters!')
      .optional(),

    start_time: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    end_time: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').nullable().optional(),

    visibility: z
      .enum([EVENT_VISIBILITY.PUBLIC, EVENT_VISIBILITY.PRIVATE], {
        message: `Visibility is required and must be either ${EVENT_VISIBILITY.PUBLIC} or ${EVENT_VISIBILITY.PRIVATE}`,
      })
      .optional(),
  })
  .refine(
    (data: { start_time?: string; end_time?: string | null }) => {
      if (data.end_time && data.start_time) {
        return new Date(data.end_time) >= new Date(data.start_time);
      }

      return true;
    },
    {
      message: 'End time must be after the start time, or the exact same!',
      path: ['end_time'],
    },
  );

export const groupEventUuidParamSchema = z.object({
  groupUuid: z.uuid('Invalid group UUID format!'),
  eventUuid: z.uuid('Invalid event UUID format!'),
});

export const addNewParticipantsBodySchema = z.object({
  participant_emails: z
    .array(z.email('One or more email addresses does not have a valid format!'))
    .min(1, 'You need to invite at least 1 participant!')
    .max(45, 'You can not invite more users than the maximum size of the group!')
    .refine((emails: string[]) => new Set(emails).size === emails.length, {
      message: 'The list contains duplicate email addresses!',
    }),
});

export const participantUuidParamSchema = z.object({
  targetUuid: z.uuid('Invalid participant UUID format!'),
});

export const groupListingFilterQuerySchema = z
  .object({
    start_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
    end_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
    title: z.string().trim().max(64, 'Title must be shorter than 64 characters long!').optional(),
    limit: z.coerce
      .number({ message: 'limit parameter must be a number!' })
      .int('limit parameter must be an integer!')
      .min(1, 'limit parameter must be greater than or equal to 1!')
      .max(50, 'limit parameter must be less than or equal to 50!')
      .default(15)
      .optional(),
    cursor: z.preprocess(
      (val: unknown) => (val === '' ? undefined : val),
      z.uuid({ message: 'Invalid cursor format! Cursor must be a valid UUID!' }).optional(),
    ),
  })
  .refine(
    (data: { start_date?: string; end_date?: string }) => {
      if (data.end_date && data.start_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }

      return true;
    },
    {
      message: 'End time must be after the start time, or the exact same!',
      path: ['end_date'],
    },
  );

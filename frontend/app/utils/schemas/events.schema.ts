// frontend/app/schemas/events.schema.ts
import { z } from 'zod';

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
    start_time: z.string().min(1, 'Start time is required!'),
    end_time: z.string().optional(),
    is_private: z.boolean(),
  })
  .refine(
    (data) => {
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

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

    // map
    latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').nullable().optional(),
    longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').nullable().optional(),
    address: z.string().max(255).nullable().optional(),
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
  )
  .refine(
    (data: { latitude?: number | null; longitude?: number | null; address?: string | null; }) => {
      const hasLat = data.latitude !== undefined && data.latitude !== null;
      const hasLng = data.longitude !== undefined && data.longitude !== null;
      const hasAddress = data.address !== undefined && data.address !== null && data.address.trim() !== '';

      if (hasLat || hasLng || hasAddress) {
        return hasLat && hasLng && hasAddress;
      }

      return true;
    },
    {
      message: 'Latitude, longitude and address must all be provided together, or all left empty!',
      path: ['address'],
    }
  );

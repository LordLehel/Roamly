// frontend/schemas/files.schema.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const dateRefine = (data: { issue_date?: string; expiry_date?: string }) => {
  if (data.issue_date && data.expiry_date) {
    return new Date(data.expiry_date) > new Date(data.issue_date);
  }
  return true;
};

export const privateDocumentSchema = z
  .object({
    file: z
      .instanceof(File, { message: 'File is required' })
      .refine((f) => f.size <= MAX_FILE_SIZE, 'File size must be less than 5MB'),
    document_type: z.enum(['ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER'], {
      message: 'Invalid document type!',
    }),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
  })
  .refine(dateRefine, {
    message: 'Expiry date must be after the issue date!',
    path: ['expiry_date'],
  });

export const groupDocumentSchema = z
  .object({
    file: z.instanceof(File, { message: 'File is required' }),
    document_type: z.enum(
      ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
      {
        message: 'Invalid document type!',
      },
    ),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
  })
  .refine(dateRefine, {
    message: 'Expiry date must be after the issue date!',
    path: ['expiry_date'],
  });

export const groupMediaSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  description: z.string().max(512, 'Description can not be longer then 512 characters!').optional(),
});

export const sharingUpdateSchema = z.object({
  accessLevel: z.enum(['LEADER', 'MEMBER'], {
    message: 'Access level must be LEADER or MEMBER!',
  }),
});

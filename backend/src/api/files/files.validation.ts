import { z } from 'zod';

export const uploadPrivateDocumentSchema = z
  .object({
    document_type: z
      .string()
      .min(2, 'Document type is required!')
      .max(64, 'Document type must be between 2 and 64 characters!'),

    issue_date: z.iso.datetime('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.datetime('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { issue_date?: string; expiry_date?: string }) => {
      if (data.issue_date && data.expiry_date) {
        return new Date(data.expiry_date) > new Date(data.issue_date);
      }

      return true;
    },
    {
      message: 'Expiry date must be after the issue date!',
      path: ['expiry_date'],
    },
  );

export const fileIdValidationSchema = z.object({
  fileId: z.string().regex(/^\d+$/, 'File ID must be a valid number!'),
});

import { z } from 'zod';

export const privateDocumentDataSchema = z
  .object({
    document_type: z.enum(['ID', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER'], {
      message: 'Invalid document type!, Must be ID, PASSPORT, DRIVING_LICENSE or OTHER',
    }),

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { document_type: string; issue_date?: string; expiry_date?: string }) => {
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

export const groupUuidValidationSchema = z.object({
  groupUuid: z.uuid('Invalid group UUID format!'),
});

export const sharingUpdateSchema = z.object({
  accessLevel: z.enum(['LEADER', 'MEMBER'], {
    message: 'Access level parameter is required and must be either LEADER or MEMBER!',
  }),
});

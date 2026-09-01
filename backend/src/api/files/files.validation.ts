import { z } from 'zod';
import * as FILE_CONSTANTS from '../../constants/files.constants';
import { ROLES } from '../../constants/roles.constants';

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
  accessLevel: z.enum([ROLES.LEADER, ROLES.MEMBER], {
    message: `Access level parameter is required and must be either ${ROLES.LEADER} or ${ROLES.MEMBER}!`,
  }),
});

export const groupDocumentDataSchema = z
  .object({
    document_type: z.enum(
      ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
      {
        message:
          'Invalid document type!, Must be TICKET, BOOKING_CONFIRMATION, HOTEL_VOUCHER, GUEST_REGISTRATION_CARD, or OTHER',
      },
    ),

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

export const groupMediaDataSchema = z.object({
  description: z.string().max(512, 'Description can not be longer then 512 characters!').optional(),
});

export const groupDocumentUpdateSchema = z
  .object({
    document_type: z
      .enum(
        ['TICKET', 'BOOKING_CONFIRMATION', 'HOTEL_VOUCHER', 'GUEST_REGISTRATION_CARD', 'OTHER'],
        {
          message:
            'Invalid document type!, Must be TICKET, BOOKING_CONFIRMATION, HOTEL_VOUCHER, GUEST_REGISTRATION_CARD, or OTHER',
        },
      )
      .optional(),

    issue_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),

    expiry_date: z.iso.date('Invalid date format! Use ISO format (YYYY-MM-DD)').optional(),
  })
  .refine(
    (data: { document_type?: string; issue_date?: string; expiry_date?: string }) => {
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

export const paginatedQuerySchema = z.object({
  limit: z.coerce
    .number({ message: 'limit parameter must be a number!' })
    .int('limit parameter must be an integer!')
    .min(1, 'limit parameter must be greater than or equal to 1!')
    .max(50, 'limit parameter must be less than or equal to 50!')
    .default(15),

  cursor: z.preprocess(
    (val: unknown) => (val === undefined || val === '' ? undefined : Number(val)),
    z
      .number({ message: 'Invalid cursor format! Cursor must be a valid number!' })
      .int('cursor parameter must be an integer!')
      .min(1, 'cursor parameter must be greater than or equal to 1!')
      .optional(),
  ),

  type: z
    .enum([FILE_CONSTANTS.GROUP_FILE_TYPE.DOCUMENT, FILE_CONSTANTS.GROUP_FILE_TYPE.MEDIA_FILE])
    .optional(),
});

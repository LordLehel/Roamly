import { Prisma } from '@prisma/client';

export type privateDocumentMetadata = Prisma.filesGetPayload<{
  include: {
    documents: true;
  };
}>;

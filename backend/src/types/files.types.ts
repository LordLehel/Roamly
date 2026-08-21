import { Prisma } from '@prisma/client';

export type privateDocumentMetadata = Prisma.filesGetPayload<{
  include: {
    documents: true;
  };
}>;

export type docSharedWithGroups = Prisma.file_sharesGetPayload<{
  select: {
    shared_by: true;
    shared_at: true;
    access_level: true;

    groups: {
      select: {
        name: true;
      };
    };
  };
}>;

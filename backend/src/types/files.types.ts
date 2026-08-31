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

export type GroupFile = Prisma.filesGetPayload<{
  include: {
    documents: true;
    media_files: true;

    creator: {
      select: {
        email: true;
        username: true;
        uuid: true;
      };
    };
  };
}>;

export type GroupFileWithUrl = GroupFile & {
  download_url: string;
};

export type PaginatedGroupFiles = {
  items: GroupFileWithUrl[];
  meta: {
    next_cursor: number | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
};

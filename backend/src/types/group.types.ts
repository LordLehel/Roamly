import { Prisma } from '@prisma/client';

export type GroupWithRole = Prisma.groupsGetPayload<{
  select: {
    uuid: true;
    name: true;
    current_size: true;
    created_at: true;
  };

  group_profiles: {
    select: {
      roles: {
        select: {
          type: true;
        }
      }
    }
  }
}>;

export type PaginatedGroups = {
  items: GroupWithRole[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
};

export type profileRelatedToTheGroup = Prisma.group_profilesGetPayload<{
  include: {
    roles: true;
  };
}>;
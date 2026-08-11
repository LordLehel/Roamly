import { Prisma } from '@prisma/client';

export type GroupWithLeaders = Prisma.groupsGetPayload<{
  select: {
    uuid: true;
    name: true;
    current_size: true;
    created_at: true;

    group_profiles: {
      select: {
        nickname: true;
        description: true;

        users: {
          select: {
            uuid: true;
            username: true;
            email: true;
          };
        };
      };
    };
  };
}>;

export type PaginatedGroups = {
  items: GroupWithLeaders[];
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
};

export type profileRelatedToTheGroup = Prisma.group_profilesGetPayload<{
  include: {
    roles: true;
  };
}>;

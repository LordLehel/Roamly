// frontend/app/types/paginatedGroups.type.ts
import type {
  GroupOutDto,
  RawGroupDto,
  GroupInvitesOutDto,
  RawGroupInvitesDto,
} from '~/types/groups.type';

export interface PaginatedGroupsResponse {
  items: GroupOutDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

export interface PaginatedGroupInvitesResponse {
  items: GroupInvitesOutDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

export interface RawPaginatedGroupsResponse {
  items: RawGroupDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

export interface RawPaginatedGroupInvitesResponse {
  items: RawGroupInvitesDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

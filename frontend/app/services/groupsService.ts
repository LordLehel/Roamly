// frontend/app/services/groupsService.ts
import type { GroupOutDto, RawGroupDto } from '~/types/groups.type';
import type { ApiResponse } from '~/types/api.type';
import { useApi } from '~/composables/useApi';

interface PaginatedGroupsResponse {
  items: GroupOutDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

interface RawPaginatedGroupsResponse {
  items: RawGroupDto[];
  meta: {
    next_cursor: string | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

const mapGroupData = (item: RawGroupDto): GroupOutDto => ({
  uuid: item.uuid,
  name: item.name,
  role: item.group_profiles?.[0]?.roles?.type ?? 'unknown',
  created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
  current_size: item.current_size ?? 0,
});

export const groupsService = {
  async listGroups(limit: number = 15, cursor?: string): Promise<PaginatedGroupsResponse> {
    const api = useApi();
    const query: Record<string, string | number> = { limit };
    if (cursor) {
      query.cursor = cursor;
    }
    
    const response = await api<ApiResponse<RawPaginatedGroupsResponse>>('/groups', {
      method: 'GET',
      query,
    });
    
    return {
      ...response.data,
      items: response.data.items.map(mapGroupData),
    };
  },

  async createGroup(data: { groupName: string; initialInvites?: { email: string; role: string }[] }): Promise<GroupOutDto> {
    const api = useApi();
    const response = await api<ApiResponse<RawGroupDto>>('/groups', {
      method: 'POST',
      body: data,
    });
    
    return mapGroupData(response.data);
  },

  async deleteGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}`, {
      method: 'DELETE',
    });
  },

  async joinGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/join`, {
      method: 'POST',
    });
  },

  async leaveGroup(groupUuid: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/leave`, {
      method: 'DELETE',
    });
  },

  async getPendingInvites(limit: number = 15, cursor?: string): Promise<PaginatedGroupsResponse> {
    const api = useApi();
    const query: Record<string, string | number> = { limit };
    if (cursor) {
      query.cursor = cursor;
    }
    
    const response = await api<ApiResponse<RawPaginatedGroupsResponse>>('/groups/invites', {
      method: 'GET',
      query,
    });
    
    return {
      ...response.data,
      items: response.data.items.map(mapGroupData),
    };
  },
};
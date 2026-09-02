// frontend/app/services/groupsService.ts
import type {
  GroupOutDto,
  RawGroupDto,
  GroupInfosOutDto,
  GroupInvitesOutDto,
  RawGroupInvitesDto,
} from '~/types/groups.type';
import type {
  PaginatedGroupsResponse,
  RawPaginatedGroupsResponse,
  PaginatedGroupInvitesResponse,
  RawPaginatedGroupInvitesResponse,
} from '~/types/paginatedGroups.type';
import type { ApiResponse } from '~/types/api.type';
import { useApi } from '~/composables/useApi';

const mapGroupData = (item: RawGroupDto): GroupOutDto => ({
  uuid: item.uuid,
  name: item.name,
  role: item.group_profiles?.[0]?.roles?.type ?? 'unknown',
  created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
  current_size: item.current_size ?? 0,
});

const mapGroupInviteData = (item: RawGroupInvitesDto): GroupInvitesOutDto => {
  const leaders =
    item.group_profiles
      ?.filter((p) => p.roles?.type?.toLowerCase() === 'leader')
      .map((p) => p.users?.username ?? 'Unknown') ?? [];

  return {
    uuid: item.uuid,
    name: item.name,
    leaders,
    created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
    current_size: item.current_size ?? 0,
  };
};

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

  async createGroup(data: {
    groupName: string;
    initialInvites?: { email: string; role: string }[];
  }): Promise<GroupOutDto> {
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

  async getPendingInvites(
    limit: number = 15,
    cursor?: string,
  ): Promise<PaginatedGroupInvitesResponse> {
    const api = useApi();
    const query: Record<string, string | number> = { limit };
    if (cursor) {
      query.cursor = cursor;
    }

    const response = await api<ApiResponse<RawPaginatedGroupInvitesResponse>>('/groups/invites', {
      method: 'GET',
      query,
    });

    return {
      ...response.data,
      items: response.data.items.map(mapGroupInviteData),
    };
  },

  async getGroupInfos(groupUuid: string): Promise<GroupInfosOutDto> {
    const api = useApi();
    const response = await api<ApiResponse<GroupInfosOutDto>>(`/groups/${groupUuid}`, {
      method: 'GET',
    });
    return response.data;
  },

  async updateGroup(groupUuid: string, data: { name: string }): Promise<GroupOutDto> {
    const api = useApi();
    const response = await api<ApiResponse<RawGroupDto>>(`/groups/${groupUuid}`, {
      method: 'PATCH',
      body: data,
    });

    return mapGroupData(response.data);
  },

  async inviteUser(
    groupUuid: string,
    data: { invitedUserEmail: string; inviteWithRole: string },
  ): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/invite`, {
      method: 'POST',
      body: data,
    });
  },

  async removeUserFromGroup(groupUuid: string, email: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/users/${email}`, {
      method: 'DELETE',
    });
  },

  async promoteUser(groupUuid: string, email: string): Promise<void> {
    const api = useApi();
    // JAVÍTVA: A backend útvonalhoz és validációhoz igazítva (PATCH /:groupUuid/promote)
    await api<ApiResponse<void>>(`/groups/${groupUuid}/promote`, {
      method: 'PATCH',
      body: { email },
    });
  },

  async demoteUser(groupUuid: string, email: string): Promise<void> {
    const api = useApi();
    await api<ApiResponse<void>>(`/groups/${groupUuid}/demote`, {
      method: 'PATCH',
      body: { email },
    });
  },
};

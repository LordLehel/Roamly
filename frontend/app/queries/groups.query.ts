// frontend/app/queries/groups.query.ts
import { useQuery } from '@pinia/colada';
import { unref, type Ref } from 'vue';
import { groupsService } from '~/services/groupsService';

export const useGroupsQuery = (limit: number = 15, cursor?: Ref<string | undefined> | string) => {
  return useQuery({
    key: () => ['groups', 'list', unref(cursor) ?? ''] as const,
    query: () => groupsService.listGroups(limit, unref(cursor)),
  });
};

export const usePendingInvitesQuery = (
  limit: number = 15,
  cursor?: Ref<string | undefined> | string,
) => {
  return useQuery({
    key: () => ['groups', 'invites', unref(cursor) ?? ''] as const,
    query: () => groupsService.getPendingInvites(limit, unref(cursor)),
  });
};

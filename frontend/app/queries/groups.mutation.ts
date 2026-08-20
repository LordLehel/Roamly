// frontend/app/queries/groups.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { groupsService } from '~/services/groupsService';

export const useCreateGroupMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (data: { groupName: string; initialInvites?: { email: string; role: string }[] }) =>
      groupsService.createGroup(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups'] });
    },
  });
};

export const useDeleteGroupMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.deleteGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups'] });
    },
  });
};
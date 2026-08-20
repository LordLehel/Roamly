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

export const useJoinGroupMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.joinGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups'] });
    },
  });
};

export const useLeaveGroupMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (groupUuid: string) => groupsService.leaveGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups'] });
    },
  });
};

export const useUpdateGroupMutation = () => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: ({ groupUuid, name }: { groupUuid: string; name: string }) =>
      groupsService.updateGroup(groupUuid, { name }),
    onSuccess: (data, variables) => {
      queryCache.invalidateQueries({ key: ['groups'] });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
    },
  });
};

export const useInviteUserMutation = () => {
  return useMutation({
    mutation: ({ groupUuid, data }: { groupUuid: string; data: { invitedUserEmail: string; inviteWithRole: string } }) =>
      groupsService.inviteUser(groupUuid, data),
  });
};

export const useRemoveUserMutation = () => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: ({ groupUuid, email }: { groupUuid: string; email: string }) =>
      groupsService.removeUserFromGroup(groupUuid, email),
    onSuccess: (data, variables) => {
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
    },
  });
};

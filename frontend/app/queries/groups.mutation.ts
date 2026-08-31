// frontend/app/queries/groups.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { groupsService } from '~/services/groupsService';

interface MutationOptions {
  onSuccess?: () => void;
}

export const useCreateGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (data: { groupName: string }) => groupsService.createGroup(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      options?.onSuccess?.();
    },
  });
};

export const useDeleteGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (groupUuid: string) => groupsService.deleteGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      options?.onSuccess?.();
    },
  });
};

export const useJoinGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (groupUuid: string) => groupsService.joinGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups', 'invites'] });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      options?.onSuccess?.();
    },
  });
};

export const useLeaveGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (groupUuid: string) => groupsService.leaveGroup(groupUuid),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['groups', 'invites'] });
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      options?.onSuccess?.();
    },
  });
};

export const useUpdateGroupMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: ({ groupUuid, name }: { groupUuid: string; name: string }) =>
      groupsService.updateGroup(groupUuid, { name }),
    onSuccess: (data, variables) => {
      queryCache.invalidateQueries({ key: ['groups', 'list'] });
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
      options?.onSuccess?.();
    },
  });
};

export const useInviteUserMutation = (options?: MutationOptions) => {
  return useMutation({
    mutation: ({
      groupUuid,
      data,
    }: {
      groupUuid: string;
      data: { invitedUserEmail: string; inviteWithRole: string };
    }) => groupsService.inviteUser(groupUuid, data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export const useRemoveUserMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: ({ groupUuid, email }: { groupUuid: string; email: string }) =>
      groupsService.removeUserFromGroup(groupUuid, email),
    onSuccess: (data, variables) => {
      queryCache.invalidateQueries({ key: ['groups', 'infos', variables.groupUuid] });
      options?.onSuccess?.();
    },
  });
};

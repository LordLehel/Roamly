// frontend/app/queries/user.mutation.ts
import { useMutation } from '@pinia/colada';
import { userService } from '~/services/userService';
import type { UserInDto } from '~/types/user.type';

interface MutationOptions {
  onSuccess?: () => void;
}

export const useCreateUserMutation = (options?: MutationOptions) => {
  return useMutation({
    mutation: (newUser: UserInDto) => userService.createUser(newUser),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export const useUpdateProfileMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (data: { username?: string; email?: string; phone_number?: string }) =>
      userService.updateProfile(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
      options?.onSuccess?.();
    },
  });
};

export const useChangePasswordMutation = (options?: MutationOptions) => {
  return useMutation({
    mutation: (data: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(data),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export const useDeleteProfileMutation = (options?: MutationOptions) => {
  return useMutation({
    mutation: () => userService.deleteProfile(),
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export const useUploadProfilePictureMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (file: File) => userService.uploadProfilePicture(file),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
      options?.onSuccess?.();
    },
  });
};
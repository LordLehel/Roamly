import { useMutation } from '@pinia/colada';
import { userService } from '~/services/userService';
import type { UserInDto } from '~/types/user.type';

export const useCreateUserMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutation: (newUser: UserInDto) => userService.createUser(newUser),
    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (data: { username?: string; email?: string; phone_number?: string }) =>
      userService.updateProfile(data),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutation: (data: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(data),
  });
};

export const useDeleteProfileMutation = () => {
  return useMutation({
    mutation: () => userService.deleteProfile(),
  });
};

export const useUploadProfilePictureMutation = () => {
  const queryCache = useQueryCache();
  return useMutation({
    mutation: (file: File) => userService.uploadProfilePicture(file),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['users', 'current'] });
    },
  });
};

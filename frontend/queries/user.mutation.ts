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

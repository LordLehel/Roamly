import { useMutation } from '@pinia/colada';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/login.schema';

export const useLoginUserMutation = (onSuccessCallback?: (data: { token: string }) => void) => {
  return useMutation({
    mutation: (credentials: LoginFormState) => authService.login(credentials),
    onSuccess: (data) => {
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
  });
};
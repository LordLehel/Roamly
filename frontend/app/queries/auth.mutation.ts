// frontend/app/queries/auth.mutation.ts
import { useMutation } from '@pinia/colada';
import { authService } from '~/services/authService';
import { useAuth } from '~/composables/useAuth';
import type { LoginFormState } from '~/utils/login.schema';

export const useLoginUserMutation = (onSuccessCallback?: () => void) => {
  const { token } = useAuth();

  return useMutation({
    mutation: (credentials: LoginFormState) => authService.login(credentials),
    onSuccess: (data) => {
      if (data?.token) {
        token.value = data.token;
      }
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};
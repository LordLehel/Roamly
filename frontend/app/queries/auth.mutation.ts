// frontend/app/queries/auth.mutation.ts
import { useMutation } from '@pinia/colada';
import { useAuth } from '~/composables/useAuth';
import type { LoginFormState } from '~/utils/login.schema';

export const useLoginUserMutation = (onSuccessCallback?: () => void) => {
  const { login } = useAuth();

  // we initialize the mutation
  return useMutation({
    mutation: (credentials: LoginFormState) => login(credentials),
    onSuccess: () => onSuccessCallback?.(),
  });
};

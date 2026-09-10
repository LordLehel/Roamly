// frontend/app/queries/auth.mutation.ts
import { useMutation } from '@pinia/colada';
import { useAuth } from '~/composables/useAuth';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/schemas/login.schema';

export const useLoginUserMutation = (onSuccessCallback?: () => void) => {
  const { login } = useAuth();

  return useMutation({
    mutation: (credentials: LoginFormState) => login(credentials),
    onSuccess: () => onSuccessCallback?.(),
  });
};

export const useVerifyEmailMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutation: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyEmail(email, otp),
    onSuccess: () => options?.onSuccess?.(),
    onError: (error: Error) => options?.onError?.(error),
  });
};

export const useResendVerificationMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutation: (email: string) => authService.resendVerification(email),
    onSuccess: () => options?.onSuccess?.(),
    onError: (error: Error) => options?.onError?.(error),
  });
};

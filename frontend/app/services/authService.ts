// frontend/app/services/authService.ts
import { useApi } from '~/composables/useApi';
import type { LoginFormState } from '../utils/schemas/login.schema';

export const authService = {
  login(credentials: LoginFormState) {
    const api = useApi();
    return api<{ token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  verifyEmail(email: string, otp: string) {
    const api = useApi();
    return api<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: { email, otp },
    });
  },

  resendVerification(email: string) {
    const api = useApi();
    return api<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: { email },
    });
  },
};

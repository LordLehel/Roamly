// frontend/app/services/authService.ts
import { useApi } from '~/composables/useApi';
import type { LoginFormState } from '../utils/schemas/login.schema';

export const authService = {
  // we just send a post request to the login endpoint
  login(credentials: LoginFormState) {
    const api = useApi();
    return api<{ token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },
};

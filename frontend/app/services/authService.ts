import { useApi } from '~/composables/useApi';
import type { LoginFormState } from '../utils/login.schema';

export const authService = {
  login(credentials: LoginFormState) {
    const api = useApi();
    return api<{ token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },
};
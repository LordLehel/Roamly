// frontend/app/composables/useAuth.ts
import { useCookie, useState, computed } from '#imports';
import type { UserOutDto } from '~/types/user.type';
import { authService } from '~/services/authService';
import type { LoginFormState } from '~/utils/login.schema';

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });

  const user = useState<UserOutDto | null>('user_profile', () => null);
  
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginFormState) => {
    const response = await authService.login(credentials);
    token.value = response.token;
    return response;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  return { token, user, isAuthenticated, login, logout };
}
// frontend/app/composables/useAuth.ts
import { useCookie, useState, computed } from '#imports';
import type { UserOutDto } from '../types/user.type';

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
    sameSite: 'lax',
  });

  const user = useState<UserOutDto | null>('user_profile', () => null);

  const isAuthenticated = computed(() => !!token.value);

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  return {
    token,
    user,
    isAuthenticated,
    logout,
  };
};

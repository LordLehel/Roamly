// frontend/app/composables/useApi.ts
import { useRuntimeConfig } from '#imports';
import { useAuth } from '~/composables/useAuth';

export const useApi = () => {
  const config = useRuntimeConfig();
  const { token, logout } = useAuth();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ options }) {
      if (token.value) {
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }
    },

    onResponseError({ response }) {
      if (response?.status === 401) {
        logout();
      }
    },
  });
};

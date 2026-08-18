// frontend/app/composables/useApi.ts
import { useRuntimeConfig, useCookie, navigateTo } from '#imports';

export const useApi = () => {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ options }) {
      const token = useCookie('auth_token');
      if (token.value) {
        options.headers = new Headers(options.headers);
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }
    },

    onResponseError({ response }) {
      console.error('API response error:', response?.status);

      if (response?.status === 401) {
        const token = useCookie('auth_token');
        token.value = null;
        
        if (typeof window !== 'undefined') {
          navigateTo('/login');
        }
      }
    },
  });
};

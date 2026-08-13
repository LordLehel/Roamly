export const useApi = () => {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ options }) {
     if (typeof window !== 'undefined') {
       const token = localStorage.getItem('auth_token');
       if (token) {
           options.headers = new Headers(options.headers);
           options.headers.set('Authorization', `Bearer ${token}`);
       }
     }
    },

    onResponseError({ response }) {
      console.error('API response error:', response?.status);

      if (response?.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        navigateTo('/login');
      }
    },
  });
};

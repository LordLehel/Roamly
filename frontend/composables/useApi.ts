export const useApi = () => {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ request: _req, options: _opts }) {
      // JWT token handling
    },

    onResponseError({ response }) {
      console.error('API response error:', response?.status);
    },
  });
};

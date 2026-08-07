import type { useFetch as _useFetch } from 'nuxt/app';

// We create a custom composable that wraps around the default useFetch composable,
// allowing us to add custom logic such as interceptors for requests and responses.
export const useMyFetch: typeof _useFetch = (request, opts) => {
  const config = useRuntimeConfig();

  // We create a custom fetch instance using $fetch.create
  const customFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ request: _req, options: _opts }) {
      // JWT token can be added to the request headers here if needed
    },

    onResponseError({ response }) {
      console.error('Response error:', response?.status);
    },
  });

  // We call the original useFetch composable, passing in our custom fetch instance and any additional options.
  return useFetch(request, {
    // we specifically cast opts to Record<string, unknown> to ensure that TypeScript correctly infers the types
    // and avoids any potential conflicts or errors during compilation.
    ...(opts as Record<string, unknown>),
    $fetch: customFetch,
  });
};

// We have worked around an issue mentioned in the Nuxt 3 gitHub repository regarding the overloading of the useFetch composable.
// The issue arises due to the way TypeScript handles module resolution and type inference in this context.
// By explicitly defining the type of our custom composable as typeof _useFetch, we ensure that TypeScript correctly infers the types
// and avoids any potential conflicts or errors during compilation.
//  https://github.com/nuxt/nuxt/issues/14736
//  https://github.com/nuxt/nuxt/issues/27142

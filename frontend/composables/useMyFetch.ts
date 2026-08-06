import type { UseFetchOptions } from 'nuxt/app';
import type { FetchContext } from 'ofetch';

/*
This composable is a wrapper around the useFetch composable provided by Nuxt 3.
It allows you to set a base URL for your API requests and handle JWT token authentication in a centralized manner.
You can also customize the fetch options by passing an options object to the function.
*/
export function useMyFetch<T>(request: string, opts: UseFetchOptions<T> = {}) {
  // Get the runtime configuration
  const config = useRuntimeConfig();

  // Create a custom options object that merges the base URL and any additional options provided
  const customOptions: UseFetchOptions<T> = {
    baseURL: config.public.apiBaseUrl as string,
    ...opts,

    onRequest(context: FetchContext) {
      // Here will be the JWT token handling
      console.log('Request made to:', context.request);
    },

    onResponseError(context: FetchContext) {
      console.error('Response error:', context.response?.status);
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useFetch<T>(request, customOptions as any);
}

// Keep in mind to replace any with a specific type if you have an interface defined!

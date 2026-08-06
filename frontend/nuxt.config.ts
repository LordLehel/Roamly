// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2023-10-10',
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:5000/api',
    },
  },
});

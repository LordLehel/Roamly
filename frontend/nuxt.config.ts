// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2023-10-10',
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@pinia/colada-nuxt', '@nuxt/eslint'],

  devServer: {
    port: 5000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/api',
    },
  },
});

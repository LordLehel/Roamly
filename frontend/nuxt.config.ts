// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2023-10-10',

  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt', '@pinia/colada-nuxt', '@nuxt/eslint', '@nuxt/ui'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  devServer: {
    port: 5000,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/api',
    },
  },
});

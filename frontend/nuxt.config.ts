// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process';

export default defineNuxtConfig({
  compatibilityDate: '2023-10-10',

  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/device',
  ],

  imports: {
    dirs: ['utils/constants', 'utils/schemas'],
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  routeRules: {
    '/api/**': {
      proxy: `${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/**`,
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

  googleFonts: {
    families: {
      Quicksand: [400, 500, 600, 700],
    },
    display: 'swap',
  },

  icon: {
    serverBundle: {
      collections: ['heroicons', 'mdi'],
    },

    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,jsx,tsx,md,mdc,mdx,ts}'],
      },
    },
    fallbackToApi: false,
  },
});

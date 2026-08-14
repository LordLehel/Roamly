import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';

export default withNuxt(
  prettierConfig, // Integrate Prettier configuration into the ESLint setup
  {
    // Customize ESLint rules
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
);
